import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class StemmingModel extends Model {
  @attr('number') position;
  @belongsTo('behandeling-van-agendapunt', {
    inverse: 'stemmingen',
    async: true,
  })
  behandelingVanAgendapunt;
  @attr('number') aantalOnthouders;
  @attr('number') aantalTegenstanders;
  @attr('number') aantalVoorstanders;
  @attr geheim;
  // @attr title;
  @attr('string') gevolg;
  @attr('string') onderwerp;

  /** @type {import("ember-data").DS.RecordArray} */
  @hasMany('mandataris', { inverse: null, async: true }) aanwezigen;
  @hasMany('mandataris', { inverse: null, async: true }) onthouders;
  @hasMany('mandataris', { inverse: null, async: true }) stemmers;
  @hasMany('mandataris', { inverse: null, async: true }) tegenstanders;
  @hasMany('mandataris', { inverse: null, async: true }) voorstanders;
}
