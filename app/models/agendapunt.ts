import Model, {
  attr,
  belongsTo,
  hasMany,
  type AsyncBelongsTo,
  type AsyncHasMany,
} from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type ZittingModel from './zitting';
import type BehandelingVanAgendapunt from './behandeling-van-agendapunt';

export default class Agendapunt extends Model {
  declare [Type]: 'zitting';

  @attr beschrijving?: string;
  @attr geplandOpenbaar?: boolean;
  @attr heeftOntwerpbesluit?: boolean;
  @attr('string') titel?: string;
  @attr('string-set') type?: string[];
  @attr('number') position?: number;

  @belongsTo('agendapunt', { inverse: null, async: true })
  declare vorigeAgendapunt: AsyncBelongsTo<Agendapunt>;
  @belongsTo('zitting', {
    inverse: 'agendapunten',
    async: true,
    polymorphic: true,
  })
  declare zitting: AsyncBelongsTo<ZittingModel>;

  @belongsTo('behandeling-van-agendapunt', {
    inverse: 'onderwerp',
    async: true,
  })
  declare behandeling: AsyncBelongsTo<BehandelingVanAgendapunt>;

  @hasMany('agendapunt', { inverse: null, async: true })
  declare referenties: AsyncHasMany<Agendapunt>;
}
