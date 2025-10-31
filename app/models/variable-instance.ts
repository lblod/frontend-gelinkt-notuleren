import { attr, belongsTo } from '@ember-data/model';
import Model from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type Variable from './variable';
import type TrafficSignal from './traffic-signal';

export default class VariableInstance extends Model {
  declare [Type]: 'variable-instance';

  @attr('string') uri?: string;

  @belongsTo('variable', { async: false, inverse: 'variableInstances' })
  declare variable: Variable;

  @belongsTo('traffic-signal', {
    async: false,
    inverse: 'variableInstances',
  })
  declare trafficSignal: TrafficSignal;
}
