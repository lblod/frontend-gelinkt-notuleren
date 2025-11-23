import Model, { attr } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';

export default class Variable extends Model {
  declare [Type]: 'variable';

  @attr('string') declare type:
    | 'text'
    | 'number'
    | 'date'
    | 'codelist'
    | 'location';

  @attr('string') declare label: string;
  @attr('string') declare uri: string;
  @attr('string') codelist?: string;
}
