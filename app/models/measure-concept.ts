import { attr, belongsTo, hasMany } from '@ember-data/model';
import type { AsyncBelongsTo, AsyncHasMany } from '@ember-data/model';
import Model from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type ArDesign from './ar-design';
import type Variable from './variable';
import type SignalConcept from './signal-concept';

export default class MeasureConcept extends Model {
  declare [Type]: 'measure-concept';

  @attr('string') uri?: string;
  @attr('string') label?: string;
  @attr('string') templateString?: string;
  @attr('string') rawTemplateString?: string;

  @hasMany('variable', { async: true, inverse: 'measure' })
  declare variables: AsyncHasMany<Variable>;

  @hasMany('signal-concept', { async: true, inverse: 'measure' })
  declare signalConcepts: AsyncHasMany<SignalConcept>;

  @belongsTo('ar-design', { async: true, inverse: 'measures' })
  declare design: AsyncBelongsTo<ArDesign>;
}
