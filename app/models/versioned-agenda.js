import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default Model.extend({
  state: attr(),
  content: attr(),
  kind: attr(),
  signedResources: hasMany('signed-resource'),
  publishedResource: belongsTo('published-resource'),
  documentContainer: belongsTo('document-container'),
  editorDocument: belongsTo('editor-document')
});
