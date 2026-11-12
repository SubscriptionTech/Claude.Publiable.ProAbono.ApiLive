// Front2026 NavigationCardPair: the previous and the next page in the order of
// the navigation tree, each a NavigationCard.
import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Icon from '@site/src/components/Icon';

function NavigationCard({variant, label, title, href}) {
  return (
    <Link
      to={href}
      className={clsx('nav-card', `nav-card--${variant}`)}
      aria-label={`${label}: ${title}`}>
      <span className="nav-card__badge" aria-hidden="true">
        <Icon name={variant === 'previous' ? 'arrow-left-02' : 'arrow-right-02'} />
      </span>
      <span className="nav-card__text">
        <span className="nav-card__label">{label}</span>
        <span className="nav-card__title">{title}</span>
      </span>
    </Link>
  );
}

export default function DocPaginator({previous, next, className}) {
  if (!previous && !next) return null;
  return (
    <nav className={clsx('nav-card-pair', className)} aria-label="Pages" data-pagefind-ignore="all">
      {previous && (
        <NavigationCard variant="previous" label="Previous" title={previous.title} href={previous.permalink} />
      )}
      {next && <NavigationCard variant="next" label="Next" title={next.title} href={next.permalink} />}
    </nav>
  );
}
