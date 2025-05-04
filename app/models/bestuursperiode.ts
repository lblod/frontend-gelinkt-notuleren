import ConceptModel from './concept';

import { attr, belongsTo, type AsyncBelongsTo } from '@ember-data/model';

export default class BestuursperiodeModel extends ConceptModel {
  @attr('number') startYear?: number;
  @attr('number') endYear?: number;

  @belongsTo('bestuursperiode', { async: true, inverse: 'next' })
  declare previous: AsyncBelongsTo<BestuursperiodeModel>;
  @belongsTo('bestuursperiode', { async: true, inverse: 'previous' })
  declare next: AsyncBelongsTo<BestuursperiodeModel>;
}
