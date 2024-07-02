import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class BestuursfunctieModel extends Model {
  @attr uri;

  @belongsTo('bestuursfunctie-code', { inverse: null, async: true }) rol;

  @hasMany('bestuursorgaan', { inverse: 'bevatBestuursfunctie', async: true })
  bevatIn;

  rdfaBindings = {
    class:
      'http://data.lblod.info/vocabularies/leidinggevenden/Bestuursfunctie',
    rol: 'http://www.w3.org/ns/org#role',
    bevatIn: 'http://www.w3.org/ns/org#hasPost',
  };
}
