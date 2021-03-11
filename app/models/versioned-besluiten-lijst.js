import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default Model.extend({
  state: attr(),
  content: attr(),
  signedResources: hasMany('signed-resource'),
  publishedResource: belongsTo('published-resource'),
  zitting: belongsTo('zitting'),
  editorDocument: belongsTo('editor-document')
});
