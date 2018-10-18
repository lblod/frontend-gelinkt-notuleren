import Persoon from '@lblod/ember-rdfa-editor-mandataris-plugin/models/persoon' ;
import { hasMany } from 'ember-data/relationships';
export default Persoon.extend({
  isKandidaatVoor: hasMany('kandidatenlijst', { inverse: 'kandidaten' }),
  verkiezingsresultaten: hasMany('verkiezingsresultaat', { inverse: null})
});
