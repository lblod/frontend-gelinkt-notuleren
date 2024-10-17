import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class ZittingModel extends Model {
  @attr('datetime') geplandeStart;
  @attr('datetime') gestartOpTijdstip;
  @attr('datetime') geeindigdOpTijdstip;
  @attr opLocatie;
  @attr({ defaultValue: '' }) intro;
  @attr({ defaultValue: '' }) outro;

  @belongsTo('bestuursorgaan', { inverse: null, async: true }) bestuursorgaan;
  @belongsTo('functionaris', { inverse: null, async: true }) secretaris;
  @belongsTo('mandataris', { inverse: null, async: true }) voorzitter;

  @hasMany('agenda', { inverse: null, async: true }) publicatieAgendas;
  @hasMany('agendapunt', { inverse: 'zitting', async: true, as: 'zitting' })
  agendapunten;
  @hasMany('mandataris', { inverse: null, defaultPagination: 100, async: true })
  aanwezigenBijStart;
  @hasMany('mandataris', { inverse: null, defaultPagination: 100, async: true })
  afwezigenBijStart;
  @hasMany('intermission', { inverse: 'zitting', async: true, as: 'zitting' })
  intermissions;
  @hasMany('publishing-log', { inverse: 'zitting', async: true })
  publishingLogs;
}
