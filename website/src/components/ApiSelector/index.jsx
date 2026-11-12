// DocApi API selector: a Front2026 Dropdown listing every ProAbono API
// documentation website (`customFields.apiSites`), the one being shown marked
// current (`customFields.currentApiSite`). Choosing another leads to its site;
// the current one leads to this site's entry page.
import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Dropdown from '@site/src/components/Dropdown';

export default function ApiSelector({className, size = 'medium'}) {
  const {siteConfig} = useDocusaurusContext();
  const {apiSites = [], currentApiSite} = siteConfig.customFields;
  const home = useBaseUrl('/');
  const options = apiSites.map((site) => {
    const current = site.label === currentApiSite;
    return {key: site.label, text: site.label, href: current ? home : site.url, current};
  });
  return <Dropdown className={className} label="API" size={size} options={options} />;
}
