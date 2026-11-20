// The classes the cookie consent (ConsentAnalytics) sets on <html> to show
// its banner and its preferences, and to block the page behind them.
//
// Docusaurus manages the `class` attribute of <html> through
// react-helmet-async, which rewrites the whole attribute at hydration and on
// every change of page: without this module, the banner shows, then vanishes
// as soon as the page hydrates. The consent adds and removes these classes
// with `classList` alone, never with `setAttribute`, so a rewrite of the
// attribute keeps those present, and the consent's own changes go through
// untouched.
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

const CONSENT_CLASSES = ['show--consent', 'show--preferences', 'disable--interaction'];

if (ExecutionEnvironment.canUseDOM) {
  const html = document.documentElement;
  const setAttribute = html.setAttribute;
  html.setAttribute = function setAttributeKeepingConsent(name, value) {
    if (String(name).toLowerCase() === 'class') {
      const kept = CONSENT_CLASSES.filter((consentClass) => html.classList.contains(consentClass));
      const classes = new Set(`${value}`.split(/\s+/).filter(Boolean).concat(kept));
      return setAttribute.call(this, name, [...classes].join(' '));
    }
    return setAttribute.call(this, name, value);
  };
}
