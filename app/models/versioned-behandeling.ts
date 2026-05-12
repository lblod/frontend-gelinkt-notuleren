import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type SignedResourceModel from './signed-resource';
import type { AsyncHasMany } from '@ember-data/model';
import type { AsyncBelongsTo } from '@ember-data/model';
import type PublishedResourceModel from './published-resource';
import type ZittingModel from './zitting';
import type BehandelingVanAgendapunt from './behandeling-van-agendapunt';

export default class VersionedBehandeling extends Model {
  declare [Type]: 'versioned-behandeling';

  @attr state?: string;
  @attr content?: string;
  @attr uri?: string;

  @attr('boolean', { defaultValue: false }) deleted?: boolean;
  @hasMany('signed-resource', {
    inverse: 'versionedBehandeling',
    async: true,
  })
  declare signedResources: AsyncHasMany<SignedResourceModel>;

  @belongsTo('published-resource', {
    inverse: 'versionedBehandeling',
    async: true,
  })
  declare publishedResource: AsyncBelongsTo<PublishedResourceModel>;
  @belongsTo<ZittingModel>('zitting', {
    inverse: null,
    async: true,
    polymorphic: true,
  })
  declare zitting: AsyncBelongsTo<ZittingModel>;
  @belongsTo<BehandelingVanAgendapunt>('behandeling-van-agendapunt', {
    inverse: 'versionedBehandelingen',
    async: true,
  })
  declare behandeling: AsyncBelongsTo<BehandelingVanAgendapunt>;
}
