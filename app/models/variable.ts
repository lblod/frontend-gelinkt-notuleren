import { attr, belongsTo } from '@ember-data/model';
import type { AsyncBelongsTo } from '@ember-data/model';
import Model from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type MeasureConcept from './measure-concept';

export default class Variable extends Model {
  declare [Type]: 'variable';

  @attr('string') type?: string;
  @attr('string') title?: string;
  @attr('string') uri?: string;
  @attr('string') codelist?: string;

  @belongsTo('measure-concept', { async: true, inverse: 'variables' })
  declare measure: AsyncBelongsTo<MeasureConcept>;
}
