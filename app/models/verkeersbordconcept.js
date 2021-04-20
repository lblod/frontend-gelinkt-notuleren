import Model, { attr } from '@ember-data/model';

export default class VerkeersbordconceptModel extends Model {
  @attr afbeelding;
  @attr betekenis;
  @attr verkeersbordcode;
  @attr beschrijving;
}
