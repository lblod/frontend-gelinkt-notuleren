import Model, {
  attr,
  belongsTo,
  hasMany,
  type HasMany,
} from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type MeasureDesign from './measure-design';
import type TrafficSignalConcept from './traffic-signal-concept';
import type VariableInstance from './variable-instance';

export default class TrafficSignal extends Model {
  declare [Type]: 'traffic-signal';

  @attr('string') uri?: string;

  @belongsTo('traffic-signal-concept', {
    async: false,
    inverse: 'trafficSignals',
  })
  declare trafficSignalConcept: TrafficSignalConcept;

  @hasMany('variable-instance', { async: false, inverse: 'trafficSignal' })
  declare variableInstances: HasMany<VariableInstance>;

  @belongsTo('measure-design', { async: false, inverse: 'trafficSignals' })
  declare measureDesign: MeasureDesign;
}
