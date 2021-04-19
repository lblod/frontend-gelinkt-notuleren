import Model, { attr, belongsTo } from '@ember-data/model';

export default class VerkiezingsresultaatModel extends Model {
  @attr aantalNaamstemmen;
  @attr plaatsRangorde;
  @belongsTo('persoon', { inverse: null }) isResultaatVan;
  @belongsTo('kandidatenlijst', { inverse: null }) isResultaatVoor;
  @belongsTo('verkiezingsresultaat-gevolg-code', { inverse: null }) gevolg;
}
