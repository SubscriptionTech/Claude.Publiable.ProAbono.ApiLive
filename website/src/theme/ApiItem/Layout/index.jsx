// The page area of the template: the content (breadcrumb, page, previous and
// next cards) and, from desktop, the table of contents column. Below desktop
// the table of contents is the band pinned under the top bar. Both forms are
// rendered, and the CSS shows the one of the viewport mode.
//
// The section of the page is exposed to the search index as the `section`
// filter, which the search dialog offers as its facets.
import React from 'react';
import clsx from 'clsx';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import ContentVisibility from '@theme/ContentVisibility';
import DocBreadcrumbs from '@theme/DocBreadcrumbs';
import DocItemContent from '@theme/DocItem/Content';
import DocItemFooter from '@theme/DocItem/Footer';
import DocItemPaginator from '@theme/DocItem/Paginator';
import DocItemTOCDesktop from '@theme/DocItem/TOC/Desktop';
import DocItemTOCMobile from '@theme/DocItem/TOC/Mobile';
import {useSections, sectionOfDoc} from '@site/src/components/Sections';

// The table of contents lists the level-2 and level-3 headings, and is absent
// on a page with no level-2 heading.
function useHasTOC() {
  const {frontMatter, toc} = useDoc();
  return !frontMatter.hide_table_of_contents && toc.some((heading) => heading.level === 2);
}

export default function DocItemLayout({children}) {
  const {metadata, frontMatter} = useDoc();
  const hasTOC = useHasTOC();
  const section = sectionOfDoc(useSections(), metadata.id);
  const isApiPage = Boolean(frontMatter.api || frontMatter.schema);
  return (
    <div
      className={clsx(
        'doc-item',
        hasTOC && 'doc-item--with-toc',
        isApiPage && 'doc-item--api',
      )}>
      <div className="doc-item__content">
        <ContentVisibility metadata={metadata} />
        {hasTOC && <DocItemTOCMobile />}
        <article className="doc-item__article">
          {section && (
            <meta data-pagefind-filter="section[content]" content={section.label} />
          )}
          <DocBreadcrumbs />
          <div data-pagefind-body="">
            <DocItemContent>{children}</DocItemContent>
          </div>
          <DocItemFooter />
        </article>
        <DocItemPaginator />
      </div>
      {hasTOC && (
        <div className="doc-item__toc">
          <DocItemTOCDesktop />
        </div>
      )}
    </div>
  );
}
