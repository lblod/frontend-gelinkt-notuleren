import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class Agendapunt extends Model {
  @attr beschrijving;
  @attr geplandOpenbaar;
  @attr heeftOntwerpbesluit;
  @attr('string') titel;
  @attr('string-set') type;
  @attr('number') position;

  @belongsTo('agendapunt', { inverse: null, async: true }) vorigeAgendapunt;
  @belongsTo('zitting', {
    inverse: 'agendapunten',
    async: true,
    polymorphic: true,
  })
  zitting;
  @belongsTo('behandeling-van-agendapunt', {
    inverse: 'onderwerp',
    async: true,
  })
  behandeling;

  @hasMany('agendapunt', { inverse: null, async: true }) referenties;
}
