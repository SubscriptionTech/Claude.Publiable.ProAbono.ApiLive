import React from "react";

import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useIsBrowser from "@docusaurus/useIsBrowser";
import ApiCodeBlock from "@theme/ApiExplorer/ApiCodeBlock";
import CodeTabs from "@theme/ApiExplorer/CodeTabs";

// Maps language keys (from languageTabs) to Prism syntax identifiers
const HIGHLIGHT = {
  curl: "bash",
  python: "python",
  javascript: "javascript",
  nodejs: "javascript",
  php: "php",
  go: "go",
  java: "java",
  csharp: "csharp",
  ruby: "ruby",
};

function CodeTab({ children, hidden, className }) {
  return (
    <div role="tabpanel" className={className} hidden={hidden}>
      {children}
    </div>
  );
}

/**
 * Renders static code snippets using the same CodeTabs <select> as OperationSnippets.
 * Prop `snippets`: { [languageKey]: codeString }
 * Uses groupId="code-samples" so the selected language stays in sync across all instances.
 */
export default function StaticSnippets({ snippets }) {
  const isBrowser = useIsBrowser();
  const { siteConfig } = useDocusaurusContext();
  const languageTabs = siteConfig?.themeConfig?.languageTabs ?? [];

  const tabs = languageTabs
    .filter((tab) => snippets[tab.language] != null)
    .map((tab) => ({
      language: tab.language,
      highlight: HIGHLIGHT[tab.language] ?? tab.language,
    }));

  if (!isBrowser || !tabs.length) return null;

  return (
    <CodeTabs groupId="code-samples" defaultValue={tabs[0]?.language} lazy>
      {tabs.map((tab) => (
        <CodeTab
          key={tab.language}
          value={tab.language}
          label={tab.language}
          attributes={{ className: `openapi-tabs__code-item--${tab.language}` }}
        >
          <ApiCodeBlock
            language={tab.highlight}
            className="openapi-explorer__code-block"
            showLineNumbers
          >
            {snippets[tab.language]}
          </ApiCodeBlock>
        </CodeTab>
      ))}
    </CodeTabs>
  );
}
