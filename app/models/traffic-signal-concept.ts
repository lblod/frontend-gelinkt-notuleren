import Model, { attr, hasMany } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type RoadSignCategory from './road-sign-category';

export default class TrafficSignalConcept extends Model {
  declare [Type]: 'traffic-signal-concept';

  @attr('string') declare uri: string;
  @attr('string') declare code: string;
  @attr('string') declare type: string;
  @hasMany('road-sign-category', {
    async: false,
    inverse: null,
  })
  declare categories: RoadSignCategory;
}
