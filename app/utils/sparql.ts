import * as RDF from '@rdfjs/types';

export type BindingObject<Obj extends Record<string, unknown>> = {
  [Prop in keyof Obj]: { value: string };
};

export interface QueryResult<Binding = Record<string, RDF.Term>> {
  results: {
    bindings: Binding[];
  };
}

interface QueryConfig {
  query: string;
  endpoint: string;
  abortSignal?: AbortSignal;
}

export const sparqlEscapeString = (value: string) =>
  '"""' + value.replace(/[\\"]/g, (match) => '\\' + match) + '"""';

export const sparqlEscapeBool = (value: boolean) => {
  return value ? '"true"^^xsd:boolean' : '"false"^^xsd:boolean';
};

export const sparqlEscapeUri = (value: string) => {
  return (
    '<' +
    value.replace(/[\\"<>]/g, function (match) {
      return '\\' + match;
    }) +
    '>'
  );
};

export async function executeQuery<Binding = Record<string, RDF.Term>>({
  query,
  endpoint,
  abortSignal,
}: QueryConfig) {
  const encodedQuery = encodeURIComponent(query.trim());

  const response = await fetch(endpoint, {
    method: 'POST',
    mode: 'cors',
    credentials: "same-origin",
    headers: {
      Accept: 'application/sparql-results+json',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    body: `query=${encodedQuery}`,
    signal: abortSignal,
  });

  if (response.ok) {
    return response.json() as Promise<QueryResult<Binding>>;
  } else {
    throw new Error(
      `Request to ${endpoint} was unsuccessful: [${response.status}] ${response.statusText}`,
    );
  }
}
/**
 *
 * Converts a sparql binding to a simple object contain a mapping of the binding keys to their values
 */
export function bindingToObject<Obj extends Record<string, unknown>>(
  binding: BindingObject<Obj>,
) {
  return Object.fromEntries(
    Object.entries(binding).map(([key, term]) => [key, term.value]),
    // TS doesn't give us 'keyof' from Object.entries() as a subclass could have extra fields,
    // making this technically not true, but for us we don't care as we'll put it through zod
  ) as { [Prop in keyof Obj]: string };
}
