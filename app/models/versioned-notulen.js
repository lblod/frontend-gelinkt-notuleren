import DS from 'ember-data';

export default DS.Model.extend({
  state: DS.attr(),
  content: DS.attr(),
  publicContent: DS.attr(),
  publicBehandelingen: DS.attr('uri-set'),
  kind: DS.attr(),
  signedResources: DS.hasMany('signed-resource'),
  publishedResource: DS.belongsTo('published-resource'),
  documentContainer: DS.belongsTo('document-container'),
  zitting: DS.belongsTo('zitting')
});
