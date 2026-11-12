// Front2026 Footer, in the DocApi arrangement (DocApi design): no link column;
// the mark, the legal notice and the Controls holding the ThemeToggle, in one
// row from desktop — the mark at the leading edge, the notice centred, the
// toggle at the trailing edge — stacked below desktop.
import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import ThemeToggle from '@site/src/components/ThemeToggle';

export default function Footer() {
  const {siteConfig} = useDocusaurusContext();
  const {buildYear} = siteConfig.customFields;
  const wordmark = useBaseUrl('/img/design/logo-wordmark.svg');
  return (
    <footer className="site-footer" data-pagefind-ignore="all">
      <div className="site-footer__block">
        <div className="site-footer__brand">
          {/* The mark leads to the ProAbono website (DocApi navigation) */}
          <a
            href={siteConfig.customFields.proabonoUrl}
            className="site-footer__mark"
            aria-label="ProAbono"
            style={{'--f-icon-url': `url("${wordmark}")`}}
          />
        </div>
        <p className="site-footer__notice">Copyright © {buildYear} ProAbono</p>
        <div className="site-footer__controls">
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
