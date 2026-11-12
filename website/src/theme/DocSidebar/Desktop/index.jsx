// Front2026 NavigationTree, column form (from desktop).
import React from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import DocSidebarItems from '@theme/DocSidebarItems';

function DocSidebarDesktop({path, sidebar}) {
  return (
    <nav className="tree tree--column" aria-label="Documentation" data-pagefind-ignore="all">
      <ul className={clsx(ThemeClassNames.docs.docSidebarMenu, 'tree__list')}>
        <DocSidebarItems items={sidebar} activePath={path} level={1} />
      </ul>
    </nav>
  );
}

export default React.memo(DocSidebarDesktop);
