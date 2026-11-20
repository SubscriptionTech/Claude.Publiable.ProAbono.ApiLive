// Front2026 Footer, in the arrangement of the front website: the brand (the
// mark, the default claim and the default Actions), the link Columns, the
// Controls holding the
// ThemeToggle, and the Legal line (the notice, the legal links and the
// consent link).
// DocApi: two link columns, Documentation and APIs; the Controls stand in the
// place of the third column. The links marked PLACEHOLDER are to be defined.
import React from 'react';
import clsx from 'clsx';
import isInternalUrl from '@docusaurus/isInternalUrl';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Icon from '@site/src/components/Icon';
import ThemeToggle from '@site/src/components/ThemeToggle';

// The Front2026 Footer defaults: the claim and the actions every website
// shows, by page language (`en` for a language with no text of its own), and
// the ProAbono addresses they lead to.
const DEFAULT_CLAIM = {
  en: 'When Subscription met Invoicing',
  fr: 'Quand l’abonnement rencontre la facturation',
};
const defaultActions = (language) => [
  {
    variant: 'primary',
    icon: 'mouse-left-click-04',
    href: `https://via.proabono.com/Auth/Welcome?lang=${language}`,
    label: {en: 'Try for free', fr: 'Tester gratuitement'},
  },
  {
    variant: 'secondary',
    avatar: 'avatar-demo.jpg',
    avatarStatus: 'status',
    href: `https://www.proabono.com/${language}/demo/`,
    label: {en: 'Get a demo', fr: 'Démo'},
  },
];

const DOCUMENTATION_LINKS = [
  {label: 'Knowledge base', href: 'https://docs.proabono.com/en/'},
  {
    label: 'Developer zone',
    href: 'https://docs.proabono.com/en/developer/welcome-docs-developer/',
  },
];

// PLACEHOLDER: the links below, to be defined.
const PLACEHOLDER = '#';
const LEGAL_LINKS = [
  {label: 'Privacy policy', href: PLACEHOLDER},
  {label: 'Terms of use', href: PLACEHOLDER},
];

// The consent link, last of the Legal line, in the page language: it opens
// the cookie consent preferences (ConsentAnalytics).
const CONSENT_LABEL = {en: 'Manage my consents', fr: 'Gérer mes consentements'};

// The consent script opens the preferences on a click of the `data-cc` links
// present when it starts, and prevents the default. A footer drawn after that,
// on a change of page, holds a link the script never saw: the preferences are
// then opened here, without following `#`. Without the script, the link does
// nothing.
function openConsentPreferences(event) {
  if (event.nativeEvent.defaultPrevented) return;
  event.preventDefault();
  window.paAnalytics?.showPreferences();
}

// A link to this site is a Docusaurus link; any other is a plain link, in the
// same tab.
function FooterLink({href, className, children}) {
  if (href !== PLACEHOLDER && isInternalUrl(href)) {
    return (
      <Link to={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

// One Button of the default actions: its leading icon, or its avatar with
// the status indicator over it, then its label.
function ActionButton({action, language}) {
  const avatar = useBaseUrl(`/img/design/${action.avatar ?? ''}`);
  const status = useBaseUrl(`/img/design/icon-${action.avatarStatus ?? ''}.svg`);
  return (
    <a
      href={action.href}
      className={clsx('f-button', `f-button--${action.variant}`, 'f-button--large')}>
      {action.icon && <Icon name={action.icon} className="f-button__icon" />}
      {action.avatar && (
        <span className="f-button__avatar" aria-hidden="true">
          <img className="f-button__avatar-image" src={avatar} alt="" />
          {action.avatarStatus && <img className="f-button__avatar-status" src={status} alt="" />}
        </span>
      )}
      <span className="f-button__label">{action.label[language] ?? action.label.en}</span>
    </a>
  );
}

function Column({title, links}) {
  return (
    <nav className="site-footer__column" aria-label={title}>
      <p className="site-footer__column-title">{title}</p>
      <ul className="site-footer__links">
        {links.map((link) => (
          <li key={link.label}>
            <FooterLink href={link.href} className="site-footer__link">
              {link.label}
            </FooterLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Footer() {
  const {siteConfig, i18n} = useDocusaurusContext();
  const {apiSites = [], buildYear} = siteConfig.customFields;
  // The language of the page: `fr` or `en`, and `en` for any other
  const language = i18n.currentLocale.startsWith('fr') ? 'fr' : 'en';
  const wordmark = useBaseUrl('/img/design/logo-wordmark.svg');
  const apiLinks = apiSites.map((site) => ({label: site.label, href: site.url}));
  return (
    <footer className="site-footer" data-pagefind-ignore="all">
      <div className="site-footer__block">
        <div className="site-footer__brand">
          <span
            className="site-footer__mark"
            role="img"
            aria-label="ProAbono"
            style={{'--f-icon-url': `url("${wordmark}")`}}
          />
          <p className="site-footer__claim">{DEFAULT_CLAIM[language]}</p>
          <div className="site-footer__actions">
            {defaultActions(language).map((action) => (
              <ActionButton key={action.variant} action={action} language={language} />
            ))}
          </div>
        </div>
        <Column title="Documentation" links={DOCUMENTATION_LINKS} />
        <Column title="APIs" links={apiLinks} />
        <div className="site-footer__controls">
          <ThemeToggle />
        </div>
        <div className="site-footer__legal">
          <p className="site-footer__notice">©{buildYear} ProAbono</p>
          <ul className="site-footer__legal-links">
            {LEGAL_LINKS.map((link) => (
              <li key={link.label}>
                <FooterLink href={link.href} className="site-footer__link">
                  {link.label}
                </FooterLink>
              </li>
            ))}
            <li>
              <a
                href="#"
                data-cc="show-preferencesModal"
                className="site-footer__link"
                onClick={openConsentPreferences}>
                {CONSENT_LABEL[language]}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
