import Model, { belongsTo } from '@ember-data/model';

export default class SyncModel extends Model {
  @belongsTo('editor-document', { inverse: null }) document;
}
