import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class VersionedBehandelingModel extends Model {
  @attr state;
  @attr content;
  @attr uri;

  @attr('boolean', { defaultValue: false }) deleted;
  @hasMany('signed-resource', { inverse: 'versionedBehandeling' })
  signedResources;

  @belongsTo('published-resource', { inverse: 'versionedBehandeling' })
  publishedResource;
  @belongsTo('zitting', { inverse: null }) zitting;
  @belongsTo('behandeling-van-agendapunt', {
    inverse: 'versionedBehandelingen',
  })
  behandeling;
}
