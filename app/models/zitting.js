import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class ZittingModel extends Model {
  @attr('datetime') geplandeStart;
  @attr('datetime') gestartOpTijdstip;
  @attr('datetime') geeindigdOpTijdstip;
  @attr opLocatie;
  @attr({ defaultValue: '' }) intro;
  @attr({ defaultValue: '' }) outro;

  @belongsTo('bestuursorgaan', { inverse: null }) bestuursorgaan;
  @belongsTo('functionaris', { inverse: null }) secretaris;
  @belongsTo('mandataris', { inverse: null }) voorzitter;

  @hasMany('agenda', { inverse: 'zitting' }) publicatieAgendas;
  @hasMany('agendapunt', { inverse: 'zitting' }) agendapunten;
  @hasMany('mandataris', { inverse: 'aanwezigBijZitting' }) aanwezigenBijStart;
  @hasMany('mandataris', { inverse: 'afwezigBijZitting' }) afwezigenBijStart;
  @hasMany('intermission', { inverse: 'zitting' }) intermissions;
}
