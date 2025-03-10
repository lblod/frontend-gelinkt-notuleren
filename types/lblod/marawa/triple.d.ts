declare module '@lblod/marawa/triple' {
  import { Quad } from '@rdfjs/types/data-model';
  export default class Triple {
    get subject(): string;
    get predicate(): string;
    get object(): string;
    get datatype(): string;
    get language(): string;

    isEqual(other: Triple): boolean;

    toNT(): string;

    toQuad(): Quad;
  }
}
