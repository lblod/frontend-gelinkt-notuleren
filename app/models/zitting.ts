import Model, {
  attr,
  belongsTo,
  hasMany,
  type AsyncBelongsTo,
  type AsyncHasMany,
} from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type FunctionarisModel from './functionaris';
import type BestuursorgaanModel from './bestuursorgaan';
import type MandatarisModel from './mandataris';
import type Agenda from './agenda';
import type Agendapunt from './agendapunt';
import type IntermissionModel from './intermission';
import type PublishingLogs from './publishing-log';

export default class ZittingModel extends Model {
  declare [Type]: 'zitting';

  @attr('datetime') geplandeStart?: Date;
  @attr('datetime') gestartOpTijdstip?: Date;
  @attr('datetime') geeindigdOpTijdstip?: Date;
  @attr opLocatie?: string;
  @attr({ defaultValue: '' }) declare intro: string;
  @attr({ defaultValue: '' }) declare outro: string;

  @belongsTo('bestuursorgaan', { inverse: null, async: true })
  declare bestuursorgaan: AsyncBelongsTo<BestuursorgaanModel>;
  @belongsTo('functionaris', { inverse: null, async: true })
  secretaris?: AsyncBelongsTo<FunctionarisModel>;
  @belongsTo('mandataris', { inverse: null, async: true })
  voorzitter?: AsyncBelongsTo<MandatarisModel>;

  @hasMany('agenda', { inverse: null, async: true })
  declare publicatieAgendas: AsyncHasMany<Agenda>;
  @hasMany('agendapunt', { inverse: 'zitting', async: true, as: 'zitting' })
  declare agendapunten: AsyncHasMany<Agendapunt>;

  // @ts-expect-error add types for `defaultPageSize`
  @hasMany('mandataris', { inverse: null, defaultPageSize: 100, async: true })
  declare aanwezigenBijStart: AsyncHasMany<MandatarisModel>;

  // @ts-expect-error add types for `defaultPageSize`
  @hasMany('mandataris', { inverse: null, defaultPageSize: 100, async: true })
  declare afwezigenBijStart: AsyncHasMany<MandatarisModel>;

  // @ts-expect-error add types for `defaultPageSize`
  @hasMany('mandataris', { inverse: null, defaultPageSize: 100, async: true })
  declare nietToegekendeMandatarissen: AsyncHasMany<MandatarisModel>;

  @hasMany('intermission', { inverse: 'zitting', async: true, as: 'zitting' })
  declare intermissions: AsyncHasMany<IntermissionModel>;
  @hasMany('publishing-log', { inverse: 'zitting', async: true, as: 'zitting' })
  declare publishingLogs: AsyncHasMany<PublishingLogs>;
}
