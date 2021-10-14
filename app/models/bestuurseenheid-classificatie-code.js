import Model, { attr } from '@ember-data/model';

export default class BestuurseenheidClassificatieCodeModel extends Model {
  @attr label;
  @attr scopeNote;
  @attr uri;

  rdfaBindings = {
    class: 'http://www.w3.org/2004/02/skos/core#Concept',
    label: 'http://www.w3.org/2004/02/skos/core#prefLabel',
    scopeNote: 'http://www.w3.org/2004/02/skos/core#scopeNote',
  };
}
