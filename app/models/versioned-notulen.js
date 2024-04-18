import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class VersionedNotulenModel extends Model {
  @attr state;
  @attr content;
  @attr publicContent;
  @attr publicBehandelingen;
  @attr kind;

  @attr('boolean', { defaultValue: false }) deleted;
  @hasMany('signed-resource', { inverse: 'versionedNotulen' }) signedResources;

  @belongsTo('published-resource', { inverse: 'versionedNotulen' })
  publishedResource;
  @belongsTo('editor-document', { inverse: null }) editorDocument;
  @belongsTo('zitting', { inverse: null }) zitting;
  @belongsTo('file', { inverse: null }) file;
}
