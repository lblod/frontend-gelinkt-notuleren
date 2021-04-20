import Model, { attr, hasMany } from '@ember-data/model';

export default class BestuursfunctieCodeModel extends Model {
  @attr label;
  @attr scopeNote;
  @attr uri;
  @hasMany('bestuursorgaan-classificatie-code', { inverse: 'standaardType' }) standaardTypeVan;

  rdfaBindings = {
    class: "http://www.w3.org/2004/02/skos/core#Concept",
    label: "http://www.w3.org/2004/02/skos/core#prefLabel"
  }
}
