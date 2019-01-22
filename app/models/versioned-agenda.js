import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  state: attr(),
  content: attr(),
  kind: attr(),
  signedResources: hasMany('signed-resource'),
  pulishedResource: belongsTo('published-resource'),
  documentContainer: belongsTo('document-container'),
  editorDocument: belongsTo('editor-document')
});
