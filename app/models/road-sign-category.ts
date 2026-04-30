import Model, { attr } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';

export default class RoadSignCategory extends Model {
  declare [Type]: 'road-sign-category';

  @attr('string') declare uri: string;
  @attr('string') declare label: string;
}
