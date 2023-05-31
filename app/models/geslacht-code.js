import Model, { attr } from '@ember-data/model';

export default class GeslachtCodeModel extends Model {
  @attr uri;
  @attr label;
  @attr scopeNote;

  rdfaBindings = {
    class: 'http://mu.semte.ch/vocabularies/ext/GeslachtCode',
    label: 'http://www.w3.org/2004/02/skos/core#prefLabel',
  };
}
