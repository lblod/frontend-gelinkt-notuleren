import Model, { attr } from '@ember-data/model';

export default class TijdsintervalModel extends Model {
  @attr('datetime') begin;
  @attr('datetime') einde;
}
