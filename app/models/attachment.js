import Model, { attr, belongsTo} from '@ember-data/model';

export default class AttachmentModel extends Model {
  @attr decision;
  @belongsTo("concept", { inverse: null }) type;
  @belongsTo("document-container", { inverse: "attachments" }) documentContainer;
  @belongsTo("file", { inverse: null }) file;
}
