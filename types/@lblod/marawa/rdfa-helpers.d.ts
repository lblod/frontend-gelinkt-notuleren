import RichNode from './rich-node';
import RdfaAttributes from './rdfa-attributes';

export function enrichWithRdfaProperties(
  richNode: RichNode,
  parentContext: RdfaAttributes[],
  parentPrefixes?: unknown,
  options?: Record<string, unknown>,
): void;
export function resolvePrefix(
  attribute: string,
  uri: string | string[],
  prefixes: unknown,
  documentUri?: string,
): string;
export function rdfaAttributesToTriples(
  rdfaAttributes: RdfaAttributes[],
): unknown[];
export function isFullUri(uri: string): boolean;
export function isPrefixedUri(uri: string): boolean;
