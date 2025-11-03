import Model, { attr, belongsTo } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type TrafficSignalConcept from './traffic-signal-concept';

export default class TrafficSignal extends Model {
  declare [Type]: 'traffic-signal';

  @attr('string') declare uri: string;

  @belongsTo('traffic-signal-concept', {
    async: false,
    inverse: null,
  })
  declare trafficSignalConcept: TrafficSignalConcept;
}
