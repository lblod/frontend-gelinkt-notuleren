import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class FractieModel extends Model {
  @attr uri;
  @attr naam;
  @belongsTo('fractietype', { inverse: null }) fractietype;
  @hasMany('bestuursorgaan', { inverse: null }) bestuursorganenInTijd;
  @belongsTo('bestuurseenheid', { inverse: null }) bestuurseenheid;

  rdfaBindings = {
    class: 'http://data.vlaanderen.be/ns/mandaat#Fractie',
    naam: 'http://www.w3.org/ns/regorg#legalName',
    fractietype: 'http://mu.semte.ch/vocabularies/ext/isFractietype',
    bestuursorganenInTijd: 'http://www.w3.org/ns/org#memberOf',
    bestuurseenheid: 'http://www.w3.org/ns/org#linkedTo'
  }
}
