import DS from 'ember-data';

export default DS.Model.extend({
  state: DS.attr(),
  content: DS.attr(),
  signedResources: DS.hasMany('signed-resource'),
  publishedResource: DS.belongsTo('published-resource'),
  documentContainer: DS.belongsTo('document-container'),
  editorDocument: DS.belongsTo('editor-document'),
  behandeling: DS.belongsTo('behandeling-van-agendapunt')
});
