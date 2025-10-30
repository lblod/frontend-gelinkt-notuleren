import Model, { attr, hasMany, type HasMany } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type VariableInstance from './variable-instance';

export default class Variable extends Model {
  declare [Type]: 'variable';

  @attr('string') type?: string;
  @attr('string') title?: string;
  @attr('string') uri?: string;
  @attr('string') codelist?: string;

  @hasMany('variable-instance', { async: false, inverse: 'variable' })
  declare measure: HasMany<VariableInstance>;
}
