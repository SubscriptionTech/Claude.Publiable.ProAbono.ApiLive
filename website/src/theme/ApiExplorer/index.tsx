/* ============================================================================
 * Swizzled from docusaurus-theme-openapi-docs
 *
 * Request and Response components are intentionally omitted — the API does not
 * allow cross-domain calls (CORS). See description/backlog/request-from-site.md
 * ========================================================================== */

import React from "react";

import { useDoc } from "@docusaurus/plugin-content-docs/client";
import ApiExamples from "@theme/ApiExplorer/ApiExamples";
import CodeSnippets from "@theme/ApiExplorer/CodeSnippets";
import SecuritySchemes from "@theme/ApiExplorer/SecuritySchemes";
import type { ApiItem } from "docusaurus-plugin-openapi-docs/src/types";
import * as sdk from "postman-collection";

function ApiExplorer({
  item,
  infoPath,
}: {
  item: NonNullable<ApiItem>;
  infoPath: string;
}) {
  const metadata = useDoc();
  const { mask_credentials } = metadata.frontMatter;

  const postman = new sdk.Request(
    item.postman
      ? sdk.Request.isRequest(item.postman)
        ? (item.postman as any).toJSON()
        : (item.postman as any)
      : {}
  );

  return (
    <>
      <SecuritySchemes infoPath={infoPath} />
      {item.method !== "event" && (
        <>
          <CodeSnippets
            postman={postman}
            codeSamples={(item as any)["x-codeSamples"] ?? []}
            maskCredentials={mask_credentials}
            requestBody={item.requestBody}
          />
          <ApiExamples item={item} />
        </>
      )}
    </>
  );
}

export default ApiExplorer;
