import { attr, belongsTo } from '@ember-data/model';
import type ArDesign from './ar-design';
import type { AsyncBelongsTo } from '@ember-data/model';
import Model from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';

export default class Measure extends Model {
  declare [Type]: 'measure';

  @attr('string') templateString?: string;
  @attr('string') rawTemplateString?: string;

  @attr('object-array') declare variables: Variable[];

  @belongsTo('ar-design', { async: true, inverse: 'measures' })
  declare design: AsyncBelongsTo<ArDesign>;
}

export type Variable = {
  label: string;
  type: string;
  uri: string;
};
