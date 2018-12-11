import DS from 'ember-data';
import { belongsTo } from 'ember-data/relationships';
export default DS.Model.extend({
  document: belongsTo('editor-document', { inverse: null})
});
