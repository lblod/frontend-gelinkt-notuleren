import Model, {
  type AsyncBelongsTo,
  attr,
  belongsTo,
  hasMany,
  type HasMany,
} from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import MeasureConcept from './measure-concept';
import type ArDesign from './ar-design';
import type TrafficSignal from './traffic-signal';

export default class MeasureDesign extends Model {
  declare [Type]: 'measure-design';

  @attr('string') uri?: string;

  @hasMany('traffic-signal', { async: false, inverse: 'measureDesign' })
  declare trafficSignals: HasMany<TrafficSignal>;

  @belongsTo('ar-design', { async: true, inverse: 'measureDesigns' })
  declare design: AsyncBelongsTo<ArDesign>;

  @belongsTo('measure-concept', { async: false, inverse: 'measureDesign' })
  declare measureConcept: MeasureConcept;
}
