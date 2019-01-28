import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';

export default Model.extend({
  state: attr(),
  content: attr(),
  kind: attr(),
  signedResources: hasMany('signed-resource'),
  publishedResource: belongsTo('published-resource'),
  documentContainer: belongsTo('document-container'),
  editorDocument: belongsTo('editor-document')
});
