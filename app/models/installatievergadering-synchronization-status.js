import Model, { attr } from '@ember-data/model';

export default class InstallatieVergaderingSynchronizationStatusModel extends Model {
  @attr('datetime') timestamp;
  @attr('boolean') success;
  @attr('string') errorMessage;
}
