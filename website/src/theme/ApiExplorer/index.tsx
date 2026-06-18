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

  // The openapi-to-postmanv2 converter is configured with schemaFaker:false and
  // resolves to schema (not example), so it always produces an empty body. We
  // extract the first example directly from the OpenAPI requestBody and write it
  // into the existing body object in-place (safer than replacing with a new
  // RequestBody, which may not survive cloneDeep in buildPostmanRequest).
  if (item.requestBody?.content && (postman.body as any)?.mode === "raw") {
    const contentType = Object.keys(item.requestBody.content)[0];
    const media = item.requestBody.content[contentType] as any;
    let exampleValue: any;

    if (media?.example !== undefined) {
      exampleValue = media.example;
    } else if (media?.examples) {
      const firstKey = Object.keys(media.examples)[0];
      exampleValue = media.examples[firstKey]?.value;
    }

    if (exampleValue !== undefined) {
      (postman.body as any).raw = JSON.stringify(exampleValue, null, 2);
    }
  }

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
