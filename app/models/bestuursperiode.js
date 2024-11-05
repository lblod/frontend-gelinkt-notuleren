import ConceptModel from './concept';

import { attr, belongsTo } from '@ember-data/model';

export default class BestuursperiodeModel extends ConceptModel {
  @attr('number') startYear;
  @attr('number') endYear;

  @belongsTo('bestuursperiode', { async: true, inverse: 'next' }) previous;
  @belongsTo('bestuursperiode', { async: true, inverse: 'previous' }) next;
}
