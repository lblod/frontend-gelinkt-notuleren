import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class VersionedBehandelingModel extends Model {
  @attr state;
  @attr content;
  @attr uri;

  @attr('boolean', { defaultValue: false }) deleted;
  @hasMany('signed-resource', { inverse: 'versionedBehandeling', async: true })
  signedResources;

  @belongsTo('published-resource', {
    inverse: 'versionedBehandeling',
    async: true,
  })
  publishedResource;
  @belongsTo('zitting', { inverse: null, async: true }) zitting;
  @belongsTo('behandeling-van-agendapunt', {
    inverse: 'versionedBehandelingen',
    async: true,
  })
  behandeling;
}
