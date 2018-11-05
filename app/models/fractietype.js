import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { equal } from '@ember/object/computed';

export default Model.extend({
  uri: attr(),
  label: attr(),

  isOnafhankelijk: equal('uri', 'http://data.vlaanderen.be/id/concept/Fractietype/Onafhankelijk'),
  isSamenwerkingsverband: equal('uri', 'http://data.vlaanderen.be/id/concept/Fractietype/Samenwerkingsverband'),

  rdfaBindings: {// eslint-disable-line ember/avoid-leaking-state-in-ember-objects
    class: 'http://mu.semte.ch/vocabularies/ext/Fractietype',
    label: 'http://www.w3.org/2004/02/skos/core#prefLabel'
  }
});
