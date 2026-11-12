// Front2026 TableOfContents, column form (from desktop): the heading, then the
// anchors of the level-2 and level-3 headings; the anchor of the section being
// read is current and follows the reading.
import React from 'react';
import clsx from 'clsx';
import TOCItems from '@theme/TOCItems';

export default function TOC({className, ...props}) {
  return (
    <nav className={clsx('toc', className)} aria-label="On this page" data-pagefind-ignore="all">
      <p className="toc__heading">On this page</p>
      <TOCItems
        {...props}
        className="toc__list"
        linkClassName="toc__anchor toc-highlight"
        linkActiveClassName="toc__anchor--current"
      />
    </nav>
  );
}
