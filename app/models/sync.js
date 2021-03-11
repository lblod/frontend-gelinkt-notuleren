import Model, { belongsTo } from '@ember-data/model';
export default Model.extend({
  document: belongsTo('editor-document', { inverse: null})
});
