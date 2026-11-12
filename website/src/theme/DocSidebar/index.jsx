// Both forms of the tree are always rendered, and the CSS shows the one of the
// viewport mode: the column from the Front2026 desktop breakpoint, the panel of
// the top bar below it. (Docusaurus decides this in JavaScript at a width the
// design system does not use.)
import React from 'react';
import DocSidebarDesktop from '@theme/DocSidebar/Desktop';
import DocSidebarMobile from '@theme/DocSidebar/Mobile';

export default function DocSidebar(props) {
  return (
    <>
      <DocSidebarDesktop {...props} />
      <DocSidebarMobile {...props} />
    </>
  );
}
