import Model, { attr, hasMany } from '@ember-data/model';

export default Model.extend({
  label: attr(),
  scopeNote: attr(),
  uri: attr(),
  standaardTypeVan: hasMany('bestuursorgaan-classificatie-code', { inverse: 'standaardType' }),

  rdfaBindings: { // eslint-disable-line ember/avoid-leaking-state-in-ember-objects
    class: "http://www.w3.org/2004/02/skos/core#Concept",
    label: "http://www.w3.org/2004/02/skos/core#prefLabel"
   }
});
