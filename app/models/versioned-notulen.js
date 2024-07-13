import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class VersionedNotulenModel extends Model {
  @attr state;
  @attr content;
  @attr publicContent;
  @attr publicBehandelingen;
  @attr kind;

  @attr('boolean', { defaultValue: false }) deleted;
  @hasMany('signed-resource', { inverse: 'versionedNotulen', async: true })
  signedResources;

  @belongsTo('published-resource', { inverse: 'versionedNotulen', async: true })
  publishedResource;
  @belongsTo('editor-document', { inverse: null, async: true }) editorDocument;
  @belongsTo('zitting', { inverse: null, async: true }) zitting;
  @belongsTo('file', { inverse: null, async: true }) file;
}
