import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  aantalNaamstemmen: attr(),
  plaatsRangorde: attr(),
  isResultaatVan: belongsTo('persoon', { inverse: null }),
  isResultaatVoor: belongsTo('kandidatenlijst', { inverse: null }),
  gevolg: belongsTo('verkiezingsresultaat-gevolg-code', { inverse: null })
});
