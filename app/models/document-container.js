import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class DocumentContainerModel extends Model {
  @attr uri;

  @belongsTo('editor-document', { inverse: null, async: true }) currentVersion;
  @belongsTo('concept', { inverse: null, async: true }) status;
  @belongsTo('editor-document-folder', { inverse: null, async: true }) folder;
  @belongsTo('bestuurseenheid', { inverse: null, async: true }) publisher;

  @hasMany('editor-document', { inverse: 'documentContainer', async: true })
  revisions;
  @hasMany('attachment', { inverse: 'documentContainer', async: true })
  attachments;
  @hasMany('editor-document', { inverse: 'parts', async: true }) isPartOf;
}
