import Model, { attr } from '@ember-data/model';

export default class FractieTypeModel extends Model {
  @attr uri;
  @attr label;

  get isOnafhankelijk() {
    return this.uri === 'http://data.vlaanderen.be/id/concept/Fractietype/Onafhankelijk';
  }

  get isSamenwerkingsverband() {
    return this.uri === 'http://data.vlaanderen.be/id/concept/Fractietype/Samenwerkingsverband';
  }

  rdfaBindings = {
    class: 'http://mu.semte.ch/vocabularies/ext/Fractietype',
    label: 'http://www.w3.org/2004/02/skos/core#prefLabel'
  }
}
