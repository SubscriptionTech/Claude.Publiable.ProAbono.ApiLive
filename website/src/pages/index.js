import { Redirect } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function Home() {
  const { i18n: { currentLocale, defaultLocale } } = useDocusaurusContext();
  // In dev mode, Docusaurus does not apply the locale URL prefix for the default locale.
  // Non-default locales (e.g. /fr/) are prefixed even in dev mode.
  const isDev = process.env.NODE_ENV === 'development';
  const localePrefix = (isDev && currentLocale === defaultLocale) ? '' : `/${currentLocale}`;
  return <Redirect to={`${localePrefix}/docs/getting-started/`} />;
}
