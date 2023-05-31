import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class VersionedBesluitenLijstModel extends Model {
  @attr state;
  @attr content;
  @hasMany('signed-resource', { inverse: 'versionedBesluitenLijst' })
  signedResources;
  @belongsTo('published-resource', { inverse: 'versionedBesluitenLijst' })
  publishedResource;
  @belongsTo('zitting', { inverse: null }) zitting;
  @belongsTo('editor-document', { inverse: null }) editorDocument;
}
