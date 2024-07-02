import Model, { attr, belongsTo } from '@ember-data/model';

export default class IntermissionModel extends Model {
  @attr('datetime') startedAt;
  @attr('datetime') endedAt;
  @attr comment;
  @belongsTo('zitting', {
    inverse: 'intermissions',
    polymorphic: true,
  })
  zitting;
  @belongsTo('agenda-position', { inverse: null }) agendaPosition;
}
