// Front2026 NavigationTree → Entry: a link to one page, marked current on the
// page being shown. An operation entry carries the class `api-method <verb>`
// (from its sidebar_class_name), from which the CSS draws its MethodBadge.
import React from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {isActiveSidebarItem} from '@docusaurus/plugin-content-docs/client';
import Link from '@docusaurus/Link';
import isInternalUrl from '@docusaurus/isInternalUrl';

export default function DocSidebarItemLink({item, onItemClick, activePath, level, index, ...props}) {
  const {href, label, className, autoAddBaseUrl} = item;
  const isCurrent = isActiveSidebarItem(item, activePath);
  const isInternalLink = isInternalUrl(href);
  return (
    <li
      className={clsx(
        ThemeClassNames.docs.docSidebarItemLink,
        ThemeClassNames.docs.docSidebarItemLinkLevel(level),
        'tree__item',
        className,
      )}>
      <Link
        className={clsx('tree__row', 'tree__entry', isCurrent && 'tree__row--current')}
        autoAddBaseUrl={autoAddBaseUrl}
        aria-current={isCurrent ? 'page' : undefined}
        to={href}
        {...(isInternalLink && {onClick: onItemClick ? () => onItemClick(item) : undefined})}
        {...props}>
        <span className="tree__text">{label}</span>
      </Link>
    </li>
  );
}
