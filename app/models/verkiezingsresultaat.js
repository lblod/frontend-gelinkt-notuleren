import Model, { attr, belongsTo } from '@ember-data/model';

export default class VerkiezingsresultaatModel extends Model {
  @attr aantalNaamstemmen;
  @attr plaatsRangorde;

  @belongsTo('persoon', { inverse: null, async: true }) isResultaatVan;
  @belongsTo('kandidatenlijst', { inverse: null, async: true }) isResultaatVoor;
  @belongsTo('verkiezingsresultaat-gevolg-code', { inverse: null, async: true })
  gevolg;
}
