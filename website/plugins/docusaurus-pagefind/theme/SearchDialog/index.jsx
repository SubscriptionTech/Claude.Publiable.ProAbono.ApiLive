// The Front2026 SearchDialog (shared/Front2026/components/custom/search-dialog.md),
// wired to the Pagefind JS API. Behaviour and texts: shared/DocApi/functional/design.md
// §§ Search and Texts. Facets are the site sections (siteConfig.customFields.sections),
// read by Pagefind from the `section` filter that each content page exposes.
//
// Pagefind is loaded at runtime only, on first open: its index is written by
// `pagefind --site build` after the Docusaurus build, so it does not exist under
// `npm start`. A failed load shows the no-result line instead of crashing.
import React, {useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useAllDocsData} from '@docusaurus/plugin-content-docs/client';
import Icon from '@site/src/components/Icon';
import styles from './styles.module.css';

const TEXTS = {
  label: 'Search the documentation',
  closeLabel: 'Close',
  fieldLabel: 'Search',
  placeholder: 'Search',
  clearLabel: 'Clear',
  facetsTitle: 'Sections',
  loadMore: 'Load more results',
  unavailable: 'Search is available in the production build.',
  summary: (count, query) =>
    count === 1 ? `1 result for "${query}"` : `${count} results for "${query}"`,
  noResults: (query) => `No results for "${query}".`,
};

const PAGE_SIZE = 10;
const DEBOUNCE_MS = 150;

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// One Pagefind instance per page load, shared by every opening of the dialog.
let pagefindPromise = null;

function loadPagefind(url, baseUrl) {
  if (!pagefindPromise) {
    pagefindPromise = (async () => {
      const pagefind = await import(/* webpackIgnore: true */ url);
      await pagefind.options({excerptLength: 30, baseUrl});
      pagefind.init();
      // Loading every filter first is what makes each search return its counts.
      const allFilters = await pagefind.filters();
      return {pagefind, allFilters};
    })();
  }
  return pagefindPromise;
}

// The sections that hold at least one doc, in the configured order.
function useSectionsWithPages() {
  const {siteConfig} = useDocusaurusContext();
  const allDocsData = useAllDocsData();
  return useMemo(() => {
    const sections = siteConfig.customFields?.sections ?? [];
    const docIds = Object.values(allDocsData).flatMap((plugin) =>
      plugin.versions.flatMap((version) => version.docs.map((doc) => doc.id)),
    );
    return sections.filter(
      (section) =>
        !section.docIdPrefix || docIds.some((id) => id.startsWith(section.docIdPrefix)),
    );
  }, [siteConfig, allDocsData]);
}

function Facet({label, count, selected, onToggle}) {
  // A facet with no match is disabled, except a selected one: it stays clearable.
  const disabled = count === 0 && !selected;
  return (
    <label
      className={clsx(
        styles.facet,
        selected && styles.facetSelected,
        disabled && styles.facetDisabled,
      )}>
      <input
        type="checkbox"
        className={styles.facetInput}
        checked={selected}
        disabled={disabled}
        onChange={() => onToggle(label)}
      />
      <span className={styles.facetBox} aria-hidden="true">
        {selected && <Icon name="tick-02" className={styles.facetTick} />}
      </span>
      <span className={styles.facetText}>
        {label}
        {count != null && ` (${count})`}
      </span>
    </label>
  );
}

function Result({title, href, excerpt, onFollow}) {
  return (
    <div className={styles.result}>
      <Link to={href} className={styles.resultTitle} onClick={onFollow}>
        {title}
      </Link>
      <p
        className={styles.excerpt}
        // Pagefind escapes the page text and adds only <mark> around the terms.
        dangerouslySetInnerHTML={{__html: excerpt}}
      />
    </div>
  );
}

// Docusaurus headings end with a hash link holding a zero-width space, which
// Pagefind keeps in the heading text.
const cleanTitle = (text) => (text ?? '').replace(/​/g, '').trim();

function ResultGroup({data, onFollow}) {
  const title = cleanTitle(data.meta?.title) || data.url;
  const type = data.filters?.section?.[0];
  const subResults = data.sub_results?.length
    ? data.sub_results
    : [{title, url: data.url, excerpt: data.excerpt}];
  return (
    <article className={styles.group}>
      <Link to={data.url} className={styles.groupTitle} onClick={onFollow}>
        {title}
      </Link>
      <div className={styles.groupResults}>
        {subResults.map((sub) => (
          <Result
            key={sub.url}
            title={cleanTitle(sub.title) || title}
            href={sub.url}
            excerpt={sub.excerpt}
            onFollow={onFollow}
          />
        ))}
      </div>
      {type && <span className={styles.chip}>{type}</span>}
    </article>
  );
}

export default function SearchDialog({onClose}) {
  const {siteConfig} = useDocusaurusContext();
  const pagefindUrl = useBaseUrl('/pagefind/pagefind.js');
  const configuredSections = useSectionsWithPages();

  const panelRef = useRef(null);
  const inputRef = useRef(null);
  const requestRef = useRef(0);
  const facetsTitleId = useId();

  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState([]);
  const [engine, setEngine] = useState(null); // {pagefind, allFilters}
  const [unavailable, setUnavailable] = useState(false);
  // null before a search; otherwise {query, results, counts}
  const [search, setSearch] = useState(null);
  const [loaded, setLoaded] = useState([]); // data() of the shown results
  const [loadingMore, setLoadingMore] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Load Pagefind on first open.
  useEffect(() => {
    let cancelled = false;
    loadPagefind(pagefindUrl, siteConfig.baseUrl).then(
      (result) => !cancelled && setEngine(result),
      () => !cancelled && setUnavailable(true),
    );
    return () => {
      cancelled = true;
    };
  }, [pagefindUrl, siteConfig.baseUrl]);

  // Facets: the configured sections that hold pages. Without a configuration,
  // the sections Pagefind knows, in its order.
  const facetLabels = useMemo(() => {
    if (configuredSections.length > 0) {
      const indexed = engine?.allFilters?.section;
      return configuredSections
        .map((section) => section.label)
        .filter((label) => !indexed || (indexed[label] ?? 0) > 0);
    }
    return Object.keys(engine?.allFilters?.section ?? {});
  }, [configuredSections, engine]);

  // Run the search as the visitor types, and whenever the facets change.
  const trimmed = query.trim();
  useEffect(() => {
    const request = ++requestRef.current;
    if (!trimmed || !engine) {
      setSearch(null);
      setLoaded([]);
      return undefined;
    }
    const timer = setTimeout(async () => {
      const options = selected.length ? {filters: {section: {any: selected}}} : {};
      const result = await engine.pagefind.search(trimmed, options);
      if (request !== requestRef.current || !result) return;
      const first = await Promise.all(
        result.results.slice(0, PAGE_SIZE).map((r) => r.data()),
      );
      if (request !== requestRef.current) return;
      setSearch({
        query: trimmed,
        results: result.results,
        // totalFilters: the count of each section for this search, as if that
        // section alone were selected — independent of the current selection.
        counts: result.totalFilters?.section ?? result.filters?.section ?? {},
      });
      setLoaded(first);
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [trimmed, selected, engine]);

  const loadMore = useCallback(async () => {
    if (!search || loadingMore) return;
    const request = requestRef.current;
    setLoadingMore(true);
    const next = await Promise.all(
      search.results.slice(loaded.length, loaded.length + PAGE_SIZE).map((r) => r.data()),
    );
    setLoadingMore(false);
    if (request === requestRef.current) setLoaded((current) => [...current, ...next]);
  }, [search, loaded, loadingMore]);

  const toggleFacet = useCallback((label) => {
    setSelected((current) =>
      current.includes(label) ? current.filter((l) => l !== label) : [...current, label],
    );
  }, []);

  // Escape closes; Tab stays inside the panel.
  const onKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose({returnFocus: true});
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current) return;
      const focusable = Array.from(panelRef.current.querySelectorAll(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !panelRef.current.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  // Focus the field on open; lock the page scroll while open.
  useLayoutEffect(() => {
    inputRef.current?.focus();
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = 'hidden';
    return () => {
      root.style.overflow = previous;
    };
  }, []);

  // Keep the focus in the dialog if it escapes (e.g. a click on the scrim).
  useEffect(() => {
    const onFocusIn = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        inputRef.current?.focus();
      }
    };
    document.addEventListener('focusin', onFocusIn);
    return () => document.removeEventListener('focusin', onFocusIn);
  }, []);

  const onFollow = useCallback(() => onClose({returnFocus: false}), [onClose]);

  const clear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const counts = search?.counts;
  const showFacets = facetLabels.length > 0;
  const hasMore = search && loaded.length < search.results.length;

  let results = null;
  if (unavailable && trimmed) {
    results = <p className={styles.noResults}>{TEXTS.unavailable}</p>;
  } else if (search && search.results.length === 0) {
    results = <p className={styles.noResults}>{TEXTS.noResults(search.query)}</p>;
  } else if (search) {
    results = (
      <>
        <p className={styles.summary}>{TEXTS.summary(search.results.length, search.query)}</p>
        <hr className={styles.rule} />
        {loaded.map((data) => (
          <React.Fragment key={data.url}>
            <ResultGroup data={data} onFollow={onFollow} />
            <hr className={styles.rule} />
          </React.Fragment>
        ))}
        {hasMore && (
          <button
            type="button"
            className={clsx('f-button f-button--secondary f-button--large', styles.loadMore)}
            onClick={loadMore}
            disabled={loadingMore}>
            <span className="f-button__label">{TEXTS.loadMore}</span>
            <Icon name="arrow-down-01-round" className="f-button__icon" />
          </button>
        )}
      </>
    );
  }

  return createPortal(
    <div
      className={styles.scrim}
      // A press on the scrim does not take the focus out of the dialog;
      // a click on it, outside the panel, closes the dialog (DocApi design).
      onMouseDown={(event) => event.target === event.currentTarget && event.preventDefault()}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose({returnFocus: true});
      }}>
      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label={TEXTS.label}
        onKeyDown={onKeyDown}>
        <div className={styles.header}>
          <div className={clsx('f-search-field', styles.field)}>
            <Icon name="search-01" className="f-search-field__icon" />
            <input
              ref={inputRef}
              type="search"
              className="f-search-field__input"
              aria-label={TEXTS.fieldLabel}
              placeholder={TEXTS.placeholder}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
            {query && (
              <button type="button" className="f-search-field__clear" onClick={clear}>
                {TEXTS.clearLabel}
              </button>
            )}
          </div>
          <button
            type="button"
            className={clsx('f-icon-button f-icon-button--ghost f-icon-button--small', styles.close)}
            aria-label={TEXTS.closeLabel}
            onClick={() => onClose({returnFocus: true})}>
            <Icon name="cancel-01" />
          </button>
        </div>
        <div className={styles.bodyFrame}>
          {scrolled && <div className={styles.fade} aria-hidden="true" />}
          <div
            className={styles.body}
            onScroll={(event) => setScrolled(event.currentTarget.scrollTop > 0)}>
            {showFacets && (
              <div className={styles.facets} role="group" aria-labelledby={facetsTitleId}>
                <p id={facetsTitleId} className={styles.facetsTitle}>
                  {TEXTS.facetsTitle}
                </p>
                <div className={styles.facetList}>
                  {facetLabels.map((label) => (
                    <Facet
                      key={label}
                      label={label}
                      count={counts ? counts[label] ?? 0 : null}
                      selected={selected.includes(label)}
                      onToggle={toggleFacet}
                    />
                  ))}
                </div>
              </div>
            )}
            <div className={styles.results} aria-live="polite">
              {results}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
