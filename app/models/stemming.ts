import Model, {
  attr,
  belongsTo,
  hasMany,
  type AsyncBelongsTo,
  type AsyncHasMany,
} from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type BehandelingVanAgendapunt from './behandeling-van-agendapunt';
import type MandatarisModel from './mandataris';

export default class StemmingModel extends Model {
  declare [Type]: 'stemming';

  @attr('number') position?: number;
  @attr('number') aantalOnthouders?: number;
  @attr('number') aantalTegenstanders?: number;
  @attr('number') aantalVoorstanders?: number;
  @attr('boolean') geheim?: boolean;
  @attr('string') gevolg?: string;
  @attr('string') onderwerp?: string;

  @belongsTo('behandeling-van-agendapunt', {
    inverse: 'stemmingen',
    async: true,
  })
  declare behandelingVanAgendapunt: AsyncBelongsTo<BehandelingVanAgendapunt>;

  @hasMany('mandataris', { inverse: null, async: true })
  declare aanwezigen: AsyncHasMany<MandatarisModel>;
  @hasMany('mandataris', { inverse: null, async: true })
  declare onthouders: AsyncHasMany<MandatarisModel>;
  @hasMany('mandataris', { inverse: null, async: true })
  declare stemmers: AsyncHasMany<MandatarisModel>;
  @hasMany('mandataris', { inverse: null, async: true })
  declare tegenstanders: AsyncHasMany<MandatarisModel>;
  @hasMany('mandataris', { inverse: null, async: true })
  declare voorstanders: AsyncHasMany<MandatarisModel>;
}
