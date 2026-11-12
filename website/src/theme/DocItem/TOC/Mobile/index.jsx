// Front2026 TableOfContents, band form (below desktop): a band pinned under
// the top bar holding a Dropdown at its small size, titled "On this page",
// whose options are every anchor, of every level, flat, in page order.
import React, {useEffect, useRef} from 'react';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import {useFilteredAndTreeifiedTOC} from '@docusaurus/theme-common/internal';
import Dropdown from '@site/src/components/Dropdown';

function flatten(nodes) {
  return nodes.flatMap((node) => [node, ...flatten(node.children)]);
}

// Strips the markup a heading's value may hold (inline code, emphasis).
function textOf(html) {
  return html.replace(/<[^>]*>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

// Publishes the band's height as --toc-band-height (0 while it is not shown),
// so that a heading reached through an anchor comes to rest under it.
function useBandHeight(ref) {
  useEffect(() => {
    const element = ref.current;
    if (!element || typeof ResizeObserver === 'undefined') return undefined;
    const root = document.documentElement;
    const observer = new ResizeObserver(() => {
      root.style.setProperty('--toc-band-height', `${element.offsetHeight}px`);
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
      root.style.removeProperty('--toc-band-height');
    };
  }, [ref]);
}

export default function DocItemTOCMobile() {
  const {toc, frontMatter} = useDoc();
  const bandRef = useRef(null);
  useBandHeight(bandRef);
  const tree = useFilteredAndTreeifiedTOC({
    toc,
    minHeadingLevel: frontMatter.toc_min_heading_level ?? 2,
    maxHeadingLevel: frontMatter.toc_max_heading_level ?? 3,
  });
  const options = flatten(tree).map((heading) => ({
    key: heading.id,
    text: textOf(heading.value),
    href: `#${heading.id}`,
  }));
  return (
    <div className="toc-band" ref={bandRef} data-pagefind-ignore="all">
      <Dropdown label="On this page" size="small" title="On this page" options={options} />
    </div>
  );
}
