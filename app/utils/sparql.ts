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
  useGet?: boolean;
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
  useGet,
}: QueryConfig) {
  const encodedQuery = encodeURIComponent(query.trim());

  const params = new URLSearchParams();
  params.append('query', query);

  const fetchOptions: RequestInit = {
    mode: 'cors',
    headers: {
      Accept: 'application/sparql-results+json',
    },
    signal: abortSignal,
  };

  let finalUrl = endpoint;

  if (useGet) {
    finalUrl = `${endpoint}?${params.toString()}`;
  } else {
    fetchOptions.method = 'POST';
    (fetchOptions.headers as { [key: string]: string })['Content-Type'] =
      'application/x-www-form-urlencoded; charset=UTF-8';
    fetchOptions.body = `query=${encodedQuery}`;
  }

  const response = await fetch(finalUrl, fetchOptions);

  if (response.ok) {
    return response.json() as Promise<QueryResult<Binding>>;
  } else {
    throw new Error(
      `Request to ${endpoint} was unsuccessful: [${response.status}] ${response.statusText}`,
    );
  }
}

export async function executeCountQuery(queryConfig: QueryConfig) {
  const response = await executeQuery<{ count: { value: string } }>(
    queryConfig,
  );

  return optionMapOr(0, parseInt, response.results.bindings[0]?.count.value);
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

type None = null | undefined;

type Option<A> = A | None;

function optionMapOr<A, U>(
  defaultValue: U,
  func: (thing: A) => U,
  thing: Option<A>,
): U {
  if (isSome(thing)) {
    return func(thing);
  }
  return defaultValue;
}

function isSome<A>(thing: Option<A>): thing is A {
  return thing !== null && thing !== undefined;
}
