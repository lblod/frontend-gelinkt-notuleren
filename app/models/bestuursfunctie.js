import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class BestuursfunctieModel extends Model {
  @attr uri;
  @belongsTo('bestuursfunctie-code', { inverse: null }) rol;
  @hasMany('bestuursorgaan', { inverse: 'bevat' }) bevatIn;

  rdfaBindings = {
    class: "http://data.lblod.info/vocabularies/leidinggevenden/Bestuursfunctie",
    rol: "http://www.w3.org/ns/org#role",
    bevatIn: "http://www.w3.org/ns/org#hasPost"
  }
}
