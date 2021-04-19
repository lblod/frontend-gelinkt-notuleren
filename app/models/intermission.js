import Model, { attr, belongsTo } from '@ember-data/model';

export default class IntermissionModel extends Model {
  @attr("datetime") startedAt;
  @attr("datetime") endedAt;
  @attr("string") comment;
  @belongsTo('zitting', { inverse: 'intermissions' }) zitting;
}
