import { attr, belongsTo } from '@ember-data/model';
import type { AsyncBelongsTo } from '@ember-data/model';
import Model from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type MeasureConcept from './measure-concept';

export default class SignalConcept extends Model {
  declare [Type]: 'signal-concept';

  @attr('string') uri?: string;
  @attr('string') code?: string;
  @attr('string') type?: string;

  @belongsTo('measure-concept', { async: true, inverse: 'signalConcepts' })
  declare measure: AsyncBelongsTo<MeasureConcept>;
}
