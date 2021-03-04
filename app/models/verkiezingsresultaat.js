import Model, { attr, belongsTo } from '@ember-data/model';

export default Model.extend({
  aantalNaamstemmen: attr(),
  plaatsRangorde: attr(),
  isResultaatVan: belongsTo('persoon', { inverse: null }),
  isResultaatVoor: belongsTo('kandidatenlijst', { inverse: null }),
  gevolg: belongsTo('verkiezingsresultaat-gevolg-code', { inverse: null })
});
