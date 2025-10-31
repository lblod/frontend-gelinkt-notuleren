import Model, { attr, hasMany, type HasMany } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type TrafficSignal from './traffic-signal';

export default class TrafficSignalConcept extends Model {
  declare [Type]: 'traffic-signal-concept';

  @attr('string') uri?: string;
  @attr('string') code?: string;
  @attr('string') type?: string;

  @hasMany('traffic-signal', { async: false, inverse: 'trafficSignalConcept' })
  declare trafficSignals: HasMany<TrafficSignal>;
}
