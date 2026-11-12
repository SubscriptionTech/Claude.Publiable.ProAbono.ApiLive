// Front2026 NavigationTree → Branch: a row naming a set of pages, which opens
// or closes it and leads to no page. A category that has a page of its own
// gives that page as the first Entry of its children. On arrival, the branches
// holding the current page are open and every other one is closed; opening a
// branch closes no other.
import React, {useEffect, useId, useState} from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {
  isActiveSidebarItem,
  useVisibleSidebarItems,
} from '@docusaurus/plugin-content-docs/client';
import DocSidebarItems from '@theme/DocSidebarItems';
import DocSidebarItemLink from '@theme/DocSidebarItem/Link';
import Icon from '@site/src/components/Icon';

function linkItemOf(category) {
  const {type, collapsed, collapsible, items, linkUnlisted, className, ...rest} = category;
  return {type: 'link', ...rest};
}

export default function DocSidebarItemCategory({item, onItemClick, activePath, level, index, ...props}) {
  const visibleChildren = useVisibleSidebarItems(item.items, activePath);
  const hasPage = typeof item.href === 'string' && !item.linkUnlisted;
  const isActive = isActiveSidebarItem(item, activePath);
  const [open, setOpen] = useState(isActive);
  const childrenId = useId();

  // Navigating into a branch opens it.
  useEffect(() => {
    if (isActive) setOpen(true);
  }, [isActive, activePath]);

  if (visibleChildren.length === 0) {
    return hasPage ? (
      <DocSidebarItemLink
        item={linkItemOf(item)}
        onItemClick={onItemClick}
        activePath={activePath}
        level={level}
        index={index}
      />
    ) : null;
  }

  return (
    <li
      className={clsx(
        ThemeClassNames.docs.docSidebarItemCategory,
        ThemeClassNames.docs.docSidebarItemCategoryLevel(level),
        'tree__item',
        'tree__branch',
        open && 'tree__branch--open',
        item.className,
      )}>
      <button
        type="button"
        className="tree__row tree__branch-row"
        aria-expanded={open}
        aria-controls={childrenId}
        onClick={() => setOpen((value) => !value)}
        {...props}>
        <span className="tree__text">{item.label}</span>
        <Icon
          name={open ? 'arrow-down-01-round' : 'arrow-right-01-round'}
          className="tree__chevron"
        />
      </button>
      <ul id={childrenId} className="tree__children" hidden={!open}>
        {hasPage && (
          <DocSidebarItemLink
            item={linkItemOf(item)}
            onItemClick={onItemClick}
            activePath={activePath}
            level={level + 1}
            index={-1}
          />
        )}
        <DocSidebarItems
          items={item.items}
          onItemClick={onItemClick}
          activePath={activePath}
          level={level + 1}
        />
      </ul>
    </li>
  );
}
