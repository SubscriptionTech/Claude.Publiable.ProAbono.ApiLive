// The sections of the site: the facets of the search, and the section each
// page belongs to. Their list and order come from
// `siteConfig.customFields.sections` ({label, docIdPrefix}): a section holds
// every doc whose id starts with `docIdPrefix`. A section holding no page is
// left out.
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useAllDocsData} from '@docusaurus/plugin-content-docs/client';

export function useSections() {
  const {siteConfig} = useDocusaurusContext();
  const docsData = useAllDocsData();
  const docs = Object.values(docsData).flatMap((plugin) =>
    plugin.versions.flatMap((version) => version.docs),
  );
  return (siteConfig.customFields.sections ?? []).filter((section) =>
    docs.some((doc) => doc.id.startsWith(section.docIdPrefix)),
  );
}

export function sectionOfDoc(sections, docId) {
  if (!docId) return undefined;
  return sections.find((section) => docId.startsWith(section.docIdPrefix));
}
