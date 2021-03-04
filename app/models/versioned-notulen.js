import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default Model.extend({
  state: attr(),
  content: attr(),
  publicContent: attr(),
  publicBehandelingen: attr('uri-set'),
  kind: attr(),
  signedResources: hasMany('signed-resource'),
  publishedResource: belongsTo('published-resource'),
  documentContainer: belongsTo('document-container'),
  zitting: belongsTo('zitting')
});
