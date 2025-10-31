import Model, { type AsyncHasMany, attr, hasMany } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type MeasureDesign from './measure-design';

export default class ArDesign extends Model {
  declare [Type]: 'ar-design';

  @attr('string') uri?: string;
  @attr('string') name?: string;
  @attr('datetime') date?: Date;

  @hasMany('measure-design', { async: true, inverse: 'design' })
  declare measureDesigns: AsyncHasMany<MeasureDesign>;
}
