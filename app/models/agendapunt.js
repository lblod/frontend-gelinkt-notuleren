import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class Agendapunt extends Model {
  @attr beschrijving;
  @attr geplandOpenbaar;
  @attr heeftOntwerpbesluit;
  @attr('string') titel;
  @attr('string-set') type;
  @attr('number') position;

  @belongsTo('agendapunt', { inverse: null }) vorigeAgendapunt;
  @belongsTo('zitting', { inverse: 'agendapunten' }) zitting;
  @belongsTo('behandeling-van-agendapunt', { inverse: 'onderwerp' })
  behandeling;

  @hasMany('agendapunt', { inverse: null }) referenties;
}
