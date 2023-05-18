import Model, { belongsTo } from '@ember-data/model';

export default class BesluitModel extends Model {
  @belongsTo('behandeling-van-agendapunt', { inverse: 'besluiten' })
  volgendUitBehandelingVanAgendapunt;
}
