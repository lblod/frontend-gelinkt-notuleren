import Model, { attr } from '@ember-data/model';

export default class FunctionarisStatusCodeModel extends Model {
  @attr uri;
  @attr label;

  rdfaBindings = {
    class: "http://data.lblod.info/vocabularies/leidinggevenden/FunctionarisStatusCode",
    label: "http://www.w3.org/2004/02/skos/core#prefLabel"
  }
}
