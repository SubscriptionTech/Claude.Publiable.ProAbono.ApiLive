import React from "react";

import ApiCodeBlock from "@theme/ApiExplorer/ApiCodeBlock";
import type { ApiItem } from "docusaurus-plugin-openapi-docs/src/types";

type MediaType = {
  schema?: { example?: unknown };
  example?: unknown;
  examples?: Record<string, { value?: unknown }>;
};

function getExamplesFromMediaType(mt: MediaType): unknown[] {
  if (mt.example !== undefined) return [mt.example];
  if (mt.schema?.example !== undefined) return [mt.schema.example];
  if (mt.examples) {
    return Object.values(mt.examples)
      .map((ex) => ex.value)
      .filter((v) => v !== undefined);
  }
  return [];
}

interface ResponseExample {
  statusCode: string;
  description: string;
  example: unknown;
}

function getResponseExamples(item: ApiItem): ResponseExample[] {
  if (!item.responses) return [];
  return Object.entries(item.responses as Record<string, any>).flatMap(
    ([statusCode, response]) => {
      if (!response.content) return [];
      return Object.values(response.content as Record<string, MediaType>)
        .flatMap(getExamplesFromMediaType)
        .map((example) => ({
          statusCode,
          description: response.description ?? "",
          example,
        }));
    }
  );
}

export default function ApiExamples({ item }: { item: ApiItem }) {
  const method = item.method.toUpperCase();
  const path = item.path;

  const body = item.requestBody as any;
  const bodyExamples: unknown[] = body?.content
    ? Object.values(body.content as Record<string, MediaType>).flatMap(
        getExamplesFromMediaType
      )
    : [];

  const responseExamples = getResponseExamples(item);

  const requestBlocks =
    bodyExamples.length > 0
      ? bodyExamples.map((ex, i) => ({
          key: `req-${i}`,
          content: `${method} ${path}\n\n${JSON.stringify(ex, null, 2)}`,
        }))
      : [{ key: "req-0", content: `${method} ${path}` }];

  return (
    <div className="api-examples">
      {requestBlocks.map(({ key, content }) => (
        // @ts-ignore
        <ApiCodeBlock
          key={key}
          language="http"
          className="openapi-explorer__code-block"
          title="Request"
        >
          {content}
        </ApiCodeBlock>
      ))}

      {responseExamples.map(({ statusCode, description, example }, i) => (
        // @ts-ignore
        <ApiCodeBlock
          key={`res-${i}`}
          language="json"
          className="openapi-explorer__code-block"
          title={description ? `${statusCode} ${description}` : statusCode}
        >
          {JSON.stringify(example, null, 2)}
        </ApiCodeBlock>
      ))}
    </div>
  );
}
