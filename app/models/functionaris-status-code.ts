import Model, { attr } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';

export default class FunctionarisStatusCodeModel extends Model {
  declare [Type]: 'functionaris-status-code';

  @attr uri?: string;
  @attr label?: string;
  @attr scopeNote?: string;

  rdfaBindings = {
    class:
      'http://data.lblod.info/vocabularies/leidinggevenden/FunctionarisStatusCode',
    label: 'http://www.w3.org/2004/02/skos/core#prefLabel',
  };
}
