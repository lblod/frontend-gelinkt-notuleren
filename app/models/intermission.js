import Model, { attr, belongsTo } from '@ember-data/model';

export default class IntermissionModel extends Model {
  @attr("datetime") startedAt;
  @attr("datetime") endedAt;
  @attr position;
  @attr comment;
  @belongsTo('zitting', { inverse: 'intermissions' }) zitting;
  @belongsTo('agendapunt') onderwerp;
}
