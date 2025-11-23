import Model, { type AsyncHasMany, attr, hasMany } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type MeasureDesign from './measure-design';

export default class ArDesign extends Model {
  declare [Type]: 'ar-design';

  @attr('string') declare uri: string;
  @attr('string') declare name: string;
  @attr('datetime') declare date: Date;

  @hasMany('measure-design', { async: true, inverse: null })
  declare measureDesigns: AsyncHasMany<MeasureDesign>;
}
