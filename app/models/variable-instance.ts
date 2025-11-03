import { attr, belongsTo } from '@ember-data/model';
import Model from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type Variable from './variable';

export default class VariableInstance extends Model {
  declare [Type]: 'variable-instance';

  @attr('string') declare uri: string;
  @attr('string') declare value: string;

  @belongsTo('variable', { async: false, inverse: null })
  declare variable: Variable;
}
