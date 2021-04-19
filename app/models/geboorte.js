import Model, { attr } from '@ember-data/model';

export default class GeboorteModel extends Model {
  @attr('date') datum;
}
