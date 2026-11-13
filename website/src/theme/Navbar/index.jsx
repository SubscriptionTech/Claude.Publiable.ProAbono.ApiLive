// Front2026 AppBarWithSearch: the mark (leading to the ProAbono website), the
// site title in place of the
// Navigation (DocApi design: the bar holds no navigation entries), the search,
// the Actions (sign-in) and, below desktop, the menu control and the panel
// holding the navigation tree. The tree is the docs sidebar, which
// DocSidebar/Mobile hands over through Docusaurus' navbar secondary menu.
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useLocation} from '@docusaurus/router';
import {useNavbarSecondaryMenu} from '@docusaurus/theme-common/internal';
import SearchBar from '@theme/SearchBar';
import Icon from '@site/src/components/Icon';

const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

// Publishes the bar's height as --app-bar-height on the document root, so that
// what is pinned under the bar, and the headings reached through an anchor,
// come to rest under it.
function useAppBarHeight(ref) {
  useIsomorphicLayoutEffect(() => {
    const element = ref.current;
    if (!element || typeof ResizeObserver === 'undefined') return undefined;
    const root = document.documentElement;
    const observer = new ResizeObserver(() => {
      root.style.setProperty('--app-bar-height', `${element.offsetHeight}px`);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
}

function SignIn({size, className}) {
  const {siteConfig} = useDocusaurusContext();
  return (
    <a
      className={clsx('f-button', 'f-button--primary', `f-button--${size}`, className)}
      href={siteConfig.customFields.signInUrl}>
      <span className="f-button__label">Sign in</span>
    </a>
  );
}

export default function Navbar() {
  const {siteConfig} = useDocusaurusContext();
  const secondaryMenu = useNavbarSecondaryMenu();
  const wordmark = useBaseUrl('/img/design/logo-wordmark.svg');
  const {pathname} = useLocation();
  const [open, setOpen] = useState(false);
  const barRef = useRef(null);
  useAppBarHeight(barRef);

  // Following a link closes the panel.
  useEffect(() => setOpen(false), [pathname]);

  // Escape closes the panel.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={clsx('app-bar', open && 'app-bar--open')} data-pagefind-ignore="all">
      {/* Docusaurus' table-of-contents highlighter reads the height of
          `.navbar` as the top of the visible area. The column it highlights
          is shown from desktop only, where the bar scrolls away and nothing
          is pinned: that offset is 0, which this never-displayed element gives. */}
      <div className="navbar" aria-hidden="true" style={{display: 'none'}} />
      {/* The bar's two rows, measured without the panel under them */}
      <div className="app-bar__bar" ref={barRef}>
        {/* The mark leads to the ProAbono website (DocApi navigation) */}
        <a href={siteConfig.customFields.proabonoUrl} className="app-bar__mark" aria-label="ProAbono">
          <span
            className="app-bar__wordmark"
            style={{'--f-icon-url': `url("${wordmark}")`}}
          />
        </a>
        {/* The site title, e.g. "API Live | Reference" */}
        <p className="app-bar__title">{siteConfig.title}</p>
        <div className="app-bar__search">
          <SearchBar />
        </div>
        <div className="app-bar__actions">
          <SignIn size="large" className="app-bar__sign-in--big-screen" />
          <SignIn size="medium" className="app-bar__sign-in--desktop" />
        </div>
        <button
          type="button"
          className="f-icon-button f-icon-button--ghost f-icon-button--small app-bar__menu"
          aria-label="Menu"
          aria-expanded={open}
          aria-controls="app-bar-panel"
          onClick={() => setOpen((value) => !value)}>
          <Icon name={open ? 'cancel-01' : 'menu-09'} />
        </button>
      </div>
      <div id="app-bar-panel" className="app-bar__panel" hidden={!open}>
        <nav className="app-bar__panel-tree" aria-label="Documentation">
          {secondaryMenu.content}
        </nav>
        <hr className="app-bar__panel-rule" />
        <div className="app-bar__panel-actions">
          <SignIn size="large" />
        </div>
      </div>
    </header>
  );
}
