import Model, { attr } from '@ember-data/model';

export default class MandatarisStatusCodeModel extends Model {
  @attr uri;
  @attr label;
}
