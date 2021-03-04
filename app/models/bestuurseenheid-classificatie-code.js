import Model, { attr } from '@ember-data/model';

export default Model.extend({
  label: attr(),
  scopeNote: attr(),
  uri: attr(),
  rdfaBindings: { // eslint-disable-line ember/avoid-leaking-state-in-ember-objects
    class: "http://www.w3.org/2004/02/skos/core#Concept",
    label: "http://www.w3.org/2004/02/skos/core#prefLabel",
    scopeNote: "http://www.w3.org/2004/02/skos/core#scopeNote"
  }
});
