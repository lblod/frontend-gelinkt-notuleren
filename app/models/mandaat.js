import Model from 'ember-data/model';
import { collect } from '@ember/object/computed';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  uri: attr(),
  // A string representation of this model, based on its attributes.
  // This is what mu-cl-resources uses to search on, and how the model will be presented while editing relationships.
  stringRep: collect.apply(this,['id', 'aantalHouders']),

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
