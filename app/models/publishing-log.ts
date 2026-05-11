import type { AsyncBelongsTo } from '@ember-data/model';
import Model, { attr, belongsTo } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type PublishedResource from './published-resource';
import type GebruikerModel from './gebruiker';
import type ZittingModel from './zitting';
import type SignedResource from './signed-resource';

export default class PublishingLog extends Model {
  declare [Type]: 'publishing-log';

  @attr action?: string;
  @attr('datetime') date?: Date;

  @belongsTo('signed-resource', { async: true, inverse: null })
  declare signedResource: AsyncBelongsTo<SignedResource>;
  @belongsTo('published-resource', { async: true, inverse: null })
  declare publishedResource: AsyncBelongsTo<PublishedResource>;

  @belongsTo('gebruiker', { async: true, inverse: null })
  declare user: AsyncBelongsTo<GebruikerModel>;
  @belongsTo('zitting', {
    async: true,
    polymorphic: true,
    inverse: 'publishingLogs',
  })
  declare zitting: AsyncBelongsTo<ZittingModel>;
}
