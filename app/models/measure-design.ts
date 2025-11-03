import Model, {
  attr,
  belongsTo,
  hasMany,
  type HasMany,
} from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import MeasureConcept from './measure-concept';
import type TrafficSignal from './traffic-signal';
import type VariableInstance from './variable-instance';

export default class MeasureDesign extends Model {
  declare [Type]: 'measure-design';

  @attr('string') declare uri: string;

  @hasMany('traffic-signal', { async: false, inverse: null })
  declare trafficSignals: HasMany<TrafficSignal>;

  @belongsTo('measure-concept', { async: false, inverse: null })
  declare measureConcept: MeasureConcept;

  @hasMany('variable-instance', { async: false, inverse: null })
  declare variableInstances: HasMany<VariableInstance>;
}
