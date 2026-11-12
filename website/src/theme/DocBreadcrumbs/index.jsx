// Front2026 Breadcrumb: the path from the site's entry page ("Home") down to
// the page shown, each crumb but the last a link to its page. Absent on the
// entry page itself, whose path has a single level. Below desktop, the crumbs
// between the first and the last give way to one collapsed crumb (CSS).
import React from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {useSidebarBreadcrumbs} from '@docusaurus/plugin-content-docs/client';
import {useLocation} from '@docusaurus/router';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import DocBreadcrumbsStructuredData from '@theme/DocBreadcrumbs/StructuredData';
import Icon from '@site/src/components/Icon';

function Separator() {
  return <Icon name="arrow-right-01-round" className="breadcrumb__separator" />;
}

export default function DocBreadcrumbs() {
  const breadcrumbs = useSidebarBreadcrumbs();
  const homeHref = useBaseUrl('/');
  const {pathname} = useLocation();
  if (!breadcrumbs || pathname === homeHref) {
    return null;
  }
  const crumbs = [
    {label: 'Home', href: homeHref},
    ...breadcrumbs.map((item) => ({
      label: item.label,
      href: item.type === 'category' && item.linkUnlisted ? undefined : item.href,
    })),
  ];
  const lastIndex = crumbs.length - 1;
  return (
    <>
      <DocBreadcrumbsStructuredData breadcrumbs={breadcrumbs} />
      <nav
        className={clsx(ThemeClassNames.docs.docBreadcrumbs, 'breadcrumb')}
        aria-label="Breadcrumb"
        data-pagefind-ignore="all">
        <ol className={clsx('breadcrumb__list', crumbs.length >= 3 && 'breadcrumb__list--collapsible')}>
          {crumbs.map((crumb, index) => {
            const isCurrent = index === lastIndex;
            return (
              <React.Fragment key={index}>
                <li
                  className={clsx(
                    'breadcrumb__crumb',
                    isCurrent && 'breadcrumb__crumb--current',
                    index > 0 && !isCurrent && 'breadcrumb__crumb--middle',
                  )}
                  aria-current={isCurrent ? 'page' : undefined}>
                  {!isCurrent && crumb.href ? (
                    <Link className="breadcrumb__text" to={crumb.href}>
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="breadcrumb__text">{crumb.label}</span>
                  )}
                  {!isCurrent && <Separator />}
                </li>
                {index === 0 && crumbs.length >= 3 && (
                  <li className="breadcrumb__crumb breadcrumb__crumb--collapsed" aria-hidden="true">
                    <span className="breadcrumb__text">…</span>
                    <Separator />
                  </li>
                )}
              </React.Fragment>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
