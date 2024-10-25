import ConceptModel from './concept';

import { attr } from '@ember-data/model';

export default class BestuursperiodeModel extends ConceptModel {
  @attr('number') start;
  @attr('number') einde;
}
