import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { collect } from '@ember/object/computed';

export default Model.extend({
  // A string representation of this model, based on its attributes.
  // This is what mu-cl-resources uses to search on, and how the model will be presented while editing relationships.
  stringRep: collect.apply(this,['id', 'naam', 'bindingEinde', 'bindingStart']),
  uri: attr(),
  naam: attr(),
  bindingEinde: attr('date'),
  bindingStart: attr('date'),
  bestuurseenheid: belongsTo('bestuurseenheid', { inverse: 'bestuursorganen' }),
  classificatie: belongsTo('bestuursorgaan-classificatie-code', { inverse: null }),
  isTijdsspecialisatieVan: belongsTo('bestuursorgaan', { inverse: 'heeftTijdsspecialisaties' }),
  wordtSamengesteldDoor: belongsTo('rechtstreekse-verkiezing', { inverse: 'steltSamen' }),
  heeftTijdsspecialisaties: hasMany('bestuursorgaan', { inverse: 'isTijdsspecialisatieVan' }),
  bevat: hasMany('mandaat', { inverse: 'bevatIn' }),

  rdfaBindings: { // eslint-disable-line ember/avoid-leaking-state-in-ember-objects
    naam: "http://www.w3.org/2004/02/skos/core#prefLabel",
    class: "http://data.vlaanderen.be/ns/besluit#Bestuursorgaan",
    bindingStart: "http://data.vlaanderen.be/ns/mandaat#bindingStart",
    bindingEinde: "http://data.vlaanderen.be/ns/mandaat#bindingEinde",
    bestuurseenheid: "http://data.vlaanderen.be/ns/besluit#bestuurt",
    classificatie: "http://data.vlaanderen.be/ns/besluit#classificatie",
    isTijdsspecialisatieVan: "http://data.vlaanderen.be/ns/mandaat#isTijdspecialisatieVan",
    bevat: "http://www.w3.org/ns/org#hasPost"
  }

});
