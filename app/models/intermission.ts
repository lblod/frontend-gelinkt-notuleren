import Model, { attr, belongsTo } from '@ember-data/model';
import type { AsyncBelongsTo } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type ZittingModel from './zitting';
import type AgendaPositionModel from './agenda-position';

export default class IntermissionModel extends Model {
  declare [Type]: 'intermission';

  @attr('datetime') startedAt?: Date;
  @attr('datetime') endedAt?: Date;
  @attr comment?: string;

  @belongsTo<ZittingModel>('zitting', {
    inverse: 'intermissions',
    async: true,
    polymorphic: true,
  })
  declare zitting: AsyncBelongsTo<ZittingModel>;
  @belongsTo('agenda-position', { inverse: null, async: true })
  declare agendaPosition: AsyncBelongsTo<AgendaPositionModel>;
}
