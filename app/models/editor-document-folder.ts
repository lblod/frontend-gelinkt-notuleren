import Model, { attr } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';

export default class EditorDocumentFolderModel extends Model {
  declare [Type]: 'editor-document-folder';

  @attr name?: string;
}
