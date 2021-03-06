import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default Model.extend({
  uri: attr(),

  aantalHouders: attr(),
  bestuursfunctie: belongsTo('bestuursfunctie-code', { inverse: null }),
  bevatIn: hasMany('bestuursorgaan', { inverse: 'bevat' }),

  rdfaBindings: { // eslint-disable-line ember/avoid-leaking-state-in-ember-objects
    class: "http://data.vlaanderen.be/ns/mandaat#Mandaat",
    aantalHouders: "http://data.vlaanderen.be/ns/mandaat#aantalHouders",
    bestuursfunctie: "http://www.w3.org/ns/org#role",
    bevatIn: "http://www.w3.org/ns/org#hasPost"
  }

});
