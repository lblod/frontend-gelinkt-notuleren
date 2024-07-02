import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class VersionedBesluitenLijstModel extends Model {
  @attr state;
  @attr content;
  @attr('boolean', { defaultValue: false }) deleted;
  @hasMany('signed-resource', {
    inverse: 'versionedBesluitenLijst',
    async: true,
  })
  signedResources;
  @belongsTo('published-resource', {
    inverse: 'versionedBesluitenLijst',
    async: true,
  })
  publishedResource;
  @belongsTo('zitting', { inverse: null, async: true }) zitting;
  @belongsTo('editor-document', { inverse: null, async: true }) editorDocument;
}
