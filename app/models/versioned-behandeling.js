import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default Model.extend({
  state: attr(),
  content: attr(),
  uri: attr(),
  signedResources: hasMany('signed-resource'),
  publishedResource: belongsTo('published-resource'),
  zitting: belongsTo('zitting'),
  behandeling: belongsTo('behandeling-van-agendapunt')
});
