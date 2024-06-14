import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class FractieModel extends Model {
  @attr uri;
  @attr naam;
  @attr generatedFrom;

  @belongsTo('fractietype', { inverse: null, async: true }) fractietype;
  @belongsTo('bestuurseenheid', { inverse: null, async: true }) bestuurseenheid;

  @hasMany('bestuursorgaan', { inverse: null, async: true })
  bestuursorganenInTijd;

  rdfaBindings = {
    class: 'http://data.vlaanderen.be/ns/mandaat#Fractie',
    naam: 'http://www.w3.org/ns/regorg#legalName',
    fractietype: 'http://mu.semte.ch/vocabularies/ext/isFractietype',
    bestuursorganenInTijd: 'http://www.w3.org/ns/org#memberOf',
    bestuurseenheid: 'http://www.w3.org/ns/org#linkedTo',
  };
}
