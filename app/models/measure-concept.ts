import Model, { attr } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';

export default class MeasureConcept extends Model {
  declare [Type]: 'measure-concept';

  @attr('string') declare uri: string;
  @attr('string') declare label: string;
  @attr('string') declare templateString: string;
  @attr('string') declare rawTemplateString: string;
}
