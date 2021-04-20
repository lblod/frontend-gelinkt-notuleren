import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class MandaatModel extends Model {
  @attr uri;
  @attr aantalHouders;
  @belongsTo('bestuursfunctie-code', { inverse: null }) bestuursfunctie;
  @hasMany('bestuursorgaan', { inverse: 'bevat' }) bevatIn;

  rdfaBindings = {
    class: "http://data.vlaanderen.be/ns/mandaat#Mandaat",
    aantalHouders: "http://data.vlaanderen.be/ns/mandaat#aantalHouders",
    bestuursfunctie: "http://www.w3.org/ns/org#role",
    bevatIn: "http://www.w3.org/ns/org#hasPost"
  }
}
