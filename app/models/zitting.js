import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { isEmpty } from '@ember/utils';

export default class ZittingModel extends Model {
  @attr('datetime') geplandeStart;
  @attr('datetime') gestartOpTijdstip;
  @attr('datetime') geeindigdOpTijdstip;
  @attr opLocatie;
  @attr afgeleidUit;
  @belongsTo('bestuursorgaan', { inverse: null }) bestuursorgaan;
  @hasMany('behandeling-van-agendapunt', { inverse: null }) behandeldeAgendapunten;
  @belongsTo('editor-document', { inverse: null }) notulen;
  @hasMany('agenda', { inverse: null }) publicatieAgendas;
  @hasMany('agendapunt', { inverse: 'zitting' }) agendapunten;
  @belongsTo('functionaris', { inverse: null }) secretaris;
  @belongsTo('mandataris', { inverse: null }) voorzitter;
  @hasMany('mandataris', { inverse: null }) aanwezigenBijStart;
  @hasMany('mandataris', { inverse: null }) afwezigenBijStart;

  get isPublished() {
    return !isEmpty(this.afgeleidUit);
  }
}
