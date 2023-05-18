import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class FractieModel extends Model {
  @attr uri;
  @attr naam;
  @attr generatedFrom;

  @belongsTo('fractietype', { inverse: null }) fractietype;
  @belongsTo('bestuurseenheid', { inverse: null }) bestuurseenheid;

  @hasMany('bestuursorgaan', { inverse: null }) bestuursorganenInTijd;

  rdfaBindings = {
    class: 'http://data.vlaanderen.be/ns/mandaat#Fractie',
    naam: 'http://www.w3.org/ns/regorg#legalName',
    fractietype: 'http://mu.semte.ch/vocabularies/ext/isFractietype',
    bestuursorganenInTijd: 'http://www.w3.org/ns/org#memberOf',
    bestuurseenheid: 'http://www.w3.org/ns/org#linkedTo',
  };
}
