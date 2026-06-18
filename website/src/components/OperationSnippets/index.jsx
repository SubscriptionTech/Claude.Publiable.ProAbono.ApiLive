import React, { useState, useEffect, useMemo } from "react";

import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useIsBrowser from "@docusaurus/useIsBrowser";
import ApiCodeBlock from "@theme/ApiExplorer/ApiCodeBlock";
import CodeTabs from "@theme/ApiExplorer/CodeTabs";
import postmanCodeGenerators from "postman-code-generators";
import * as sdk from "postman-collection";

const GENERATOR_OPTIONS = {
  longFormat: false,
  followRedirect: true,
  trimRequestBody: true,
};

function buildLanguageConfigs(languageTabs) {
  const byKey = {};
  postmanCodeGenerators.getLanguageList().forEach((lang) => {
    byKey[lang.key] = {
      language: lang.key,
      highlight: lang.syntax_mode,
      variant: lang.variants[0]?.key ?? lang.key,
      variants: lang.variants.map((v) => v.key),
    };
  });
  return languageTabs.map((tab) => byKey[tab.language]).filter(Boolean);
}

function buildPostmanRequest(method, path, baseUrl, body) {
  const headers = [
    { key: "Authorization", value: "Basic <base64(AgentKey:ApiKey)>" },
  ];
  if (body) {
    headers.push({ key: "Content-Type", value: "application/json" });
  }
  return new sdk.Request({
    method: method.toUpperCase(),
    url: `${baseUrl}${path}`,
    header: headers,
    body: body ? { mode: "raw", raw: JSON.stringify(body, null, 2) } : undefined,
  });
}

function CodeTab({ children, hidden, className }) {
  return (
    <div role="tabpanel" className={className} hidden={hidden}>
      {children}
    </div>
  );
}

export default function OperationSnippets({ method, path, baseUrl, body }) {
  const isBrowser = useIsBrowser();
  const { siteConfig } = useDocusaurusContext();

  const languageConfigs = useMemo(
    () => buildLanguageConfigs(siteConfig?.themeConfig?.languageTabs ?? []),
    // siteConfig is stable after initial load
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Pre-generate snippets for every language × variant combination.
  // Shape: { [language]: { [variant]: snippetString } }
  const [allSnippets, setAllSnippets] = useState({});

  useEffect(() => {
    if (!languageConfigs.length) return;
    const postman = buildPostmanRequest(method, path, baseUrl, body);
    const result = {};
    languageConfigs.forEach((lang) => {
      result[lang.language] = {};
      lang.variants.forEach((variant) => {
        postmanCodeGenerators.convert(
          lang.language,
          variant,
          postman,
          GENERATOR_OPTIONS,
          (err, code) => {
            if (!err) result[lang.language][variant] = code;
          }
        );
      });
    });
    setAllSnippets(result);
    // Props are static in MDX — runs once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isBrowser || !languageConfigs.length) return null;

  return (
    <CodeTabs
      groupId="code-samples"
      defaultValue={languageConfigs[0]?.language}
      lazy
    >
      {languageConfigs.map((lang) => (
        <CodeTab
          key={lang.language}
          value={lang.language}
          label={lang.language}
          attributes={{ className: `openapi-tabs__code-item--${lang.language}` }}
        >
          {/* Inner variant selector — matches CodeSnippets structure exactly */}
          <CodeTabs
            className="openapi-tabs__code-container-inner"
            defaultValue={lang.variant.toLowerCase()}
            lazy
          >
            {lang.variants.map((variant) => (
              <CodeTab
                key={`${lang.language}-${variant}`}
                value={variant.toLowerCase()}
                label={variant.toUpperCase()}
                attributes={{ className: "openapi-tabs__code-item--variant" }}
              >
                <ApiCodeBlock
                  language={lang.highlight}
                  className="openapi-explorer__code-block"
                  showLineNumbers
                >
                  {allSnippets[lang.language]?.[variant] ?? ""}
                </ApiCodeBlock>
              </CodeTab>
            ))}
          </CodeTabs>
        </CodeTab>
      ))}
    </CodeTabs>
  );
}
