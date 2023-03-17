import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class VersionedNotulesModel extends Model {
  @attr state;
  @attr content;
  @attr publicContent;
  @attr publicBehandelingen;
  @attr kind;
  @attr deleted;
  @hasMany('signed-resource') signedResources;
  @belongsTo('published-resource') publishedResource;
  @belongsTo('document-container') documentContainer;
  @belongsTo('zitting') zitting;
}
