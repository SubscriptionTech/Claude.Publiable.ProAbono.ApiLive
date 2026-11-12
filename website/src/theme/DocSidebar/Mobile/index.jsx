// Front2026 NavigationTree, panel form (below desktop): handed to the top bar,
// which shows it in its panel and closes the panel on navigation.
import React from 'react';
import clsx from 'clsx';
import {NavbarSecondaryMenuFiller, ThemeClassNames} from '@docusaurus/theme-common';
import DocSidebarItems from '@theme/DocSidebarItems';

// eslint-disable-next-line react/function-component-definition
const DocSidebarPanelTree = ({sidebar, path}) => (
  <ul className={clsx(ThemeClassNames.docs.docSidebarMenu, 'tree', 'tree--panel', 'tree__list')}>
    <DocSidebarItems items={sidebar} activePath={path} level={1} />
  </ul>
);

function DocSidebarMobile(props) {
  return <NavbarSecondaryMenuFiller component={DocSidebarPanelTree} props={props} />;
}

export default React.memo(DocSidebarMobile);
