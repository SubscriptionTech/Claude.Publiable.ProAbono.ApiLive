// The columns of the page template: the navigation tree column at the leading
// edge (from desktop), then the main area holding the page.
import React from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {useDocsSidebar} from '@docusaurus/plugin-content-docs/client';
import {useLocation} from '@docusaurus/router';
import DocSidebar from '@theme/DocSidebar';

export default function DocRootLayout({children}) {
  const sidebar = useDocsSidebar();
  const {pathname} = useLocation();
  return (
    <div className={clsx('doc-root', sidebar && 'doc-root--with-tree')}>
      {sidebar && (
        <aside className={clsx(ThemeClassNames.docs.docSidebarContainer, 'doc-root__tree')}>
          <React.Fragment key={sidebar.name}>
            <DocSidebar sidebar={sidebar.items} path={pathname} />
          </React.Fragment>
        </aside>
      )}
      <main className="doc-root__main">{children}</main>
    </div>
  );
}
