import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class AttachmentModel extends Model {
  @attr decision;
  @belongsTo("concept", { inverse: null }) type;
  @belongsTo("document-container", { inverse: "attachments" }) documentContainer;
  @belongsTo("file-resource", { inverse: null }) fileResource;
}
