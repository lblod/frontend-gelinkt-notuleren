import Model, { attr, hasMany } from '@ember-data/model';

export default class BestuursorgaanClassificatieCodeModel extends Model {
  @attr label;
  @attr scopeNote;
  @attr uri;

  @hasMany('bestuursfunctie-code', { inverse: 'standaardTypeVan', async: true })
  standaardType;
  @hasMany('bestuursorgaan', { inverse: null, async: true }) isClassificatieVan;
}
