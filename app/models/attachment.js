import Model, { attr, belongsTo } from '@ember-data/model';

export default class AttachmentModel extends Model {
  @attr decision;
  @belongsTo('concept', { inverse: null, async: true }) type;
  @belongsTo('document-container', { inverse: 'attachments', async: true })
  documentContainer;
  @belongsTo('file', { inverse: null, async: true }) file;
}
