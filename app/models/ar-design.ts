import type { AsyncHasMany } from '@ember-data/model';
import Model from '@ember-data/model';
import { hasMany } from '@ember-data/model';
import { attr } from '@ember-data/model';
import type MeasureConcept from './measure-concept';
import type { Type } from '@warp-drive/core-types/symbols';

export default class ArDesign extends Model {
  declare [Type]: 'ar-design';

  @attr('string') uri?: string;
  @attr('string') name?: string;
  @attr('datetime') date?: Date;

  @hasMany('measure-concept', { async: true, inverse: 'design' })
  declare measures: AsyncHasMany<MeasureConcept>;
}
