import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  uri: attr(),
  naam: attr(),
  fractietype: belongsTo('fractietype', { inverse: null }),
  bestuursorganenInTijd: hasMany('bestuursorgaan', { inverse: null }),
  bestuurseenheid: belongsTo('bestuurseenheid', { inverse: null }),

  rdfaBindings: { // eslint-disable-line ember/avoid-leaking-state-in-ember-objects
    class: 'http://data.vlaanderen.be/ns/mandaat#Fractie',
    naam: 'http://www.w3.org/ns/regorg#legalName',
    fractietype: 'http://mu.semte.ch/vocabularies/ext/isFractietype',
    bestuursorganenInTijd: 'http://www.w3.org/ns/org#memberOf',
    bestuurseenheid: 'http://www.w3.org/ns/org#linkedTo'
  }
});
