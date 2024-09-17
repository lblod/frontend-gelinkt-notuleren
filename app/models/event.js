import Model, { attr, hasMany } from '@ember-data/model';

export default class EventModel extends Model {
  @attr uri;
  @attr('string') description;

  @hasMany('case', { inverse: 'event', async: true }) cases;
  @hasMany('location', { inverse: 'event', async: true }) locations;
  @hasMany('timeframe', { inverse: 'event', async: true }) timeframes;
}
