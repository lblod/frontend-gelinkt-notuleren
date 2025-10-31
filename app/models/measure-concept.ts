import Model, { attr, belongsTo } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type MeasureDesign from './measure-design';

export default class MeasureConcept extends Model {
  declare [Type]: 'measure-concept';

  @attr('string') uri?: string;
  @attr('string') label?: string;
  @attr('string') templateString?: string;
  @attr('string') rawTemplateString?: string;

  @belongsTo('measure-design', { async: false, inverse: 'measure-concept' })
  declare measureDesign: MeasureDesign;
}
