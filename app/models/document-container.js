import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class DocumentContainerModel extends Model {
  @attr uri;
  @hasMany('editor-document', { inverse: 'documentContainer' }) revisions;
  @belongsTo('editor-document', { inverse: null }) currentVersion;
  @belongsTo('concept', { inverse: null }) status;
  @belongsTo('editor-document-folder', { inverse: null }) folder;
  @belongsTo('bestuurseenheid', { inverse: null }) publisher;

  @hasMany('attachment', { inverse: 'documentContainer' }) attachments;
  @hasMany('editor-document', { inverse: 'parts' }) isPartOf;
}
