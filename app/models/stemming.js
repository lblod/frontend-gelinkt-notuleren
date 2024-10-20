import Model, { attr, belongsTo } from '@ember-data/model';

export default class StemmingModel extends Model {
  @attr('number') position;
  @belongsTo('behandeling-van-agendapunt', {
    inverse: 'stemmingen',
    async: true,
  })
  behandelingVanAgendapunt;
}
