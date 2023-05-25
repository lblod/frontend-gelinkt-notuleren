import Model, { attr } from '@ember-data/model';

export default class LijsttypeModel extends Model {
  @attr uri;
  @attr label;
  @attr scopeNote;
}
