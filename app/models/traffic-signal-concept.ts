import Model, { attr } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';

export default class TrafficSignalConcept extends Model {
  declare [Type]: 'traffic-signal-concept';

  @attr('string') declare uri: string;
  @attr('string') declare code: string;
  @attr('string') declare type: string;
}
