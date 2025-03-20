import Model, {
  attr,
  belongsTo,
  hasMany,
  type AsyncBelongsTo,
  type AsyncHasMany,
} from '@ember-data/model';
import { type Type } from '@warp-drive/core-types/symbols';
import type EditorDocumentModel from './editor-document';
import type ConceptModel from './concept';
import type EditorDocumentFolderModel from './editor-document-folder';
import type BestuurseenheidModel from './bestuurseenheid';
import type AttachmentModel from './attachment';

export default class DocumentContainerModel extends Model {
  declare [Type]: 'document-container';

  @attr declare uri: string;

  @belongsTo<EditorDocumentModel>('editor-document', {
    inverse: null,
    async: true,
  })
  declare currentVersion: AsyncBelongsTo<EditorDocumentModel>;
  @belongsTo('concept', { inverse: null, async: true })
  declare status: AsyncBelongsTo<ConceptModel>;
  @belongsTo('editor-document-folder', { inverse: null, async: true })
  declare folder: AsyncBelongsTo<EditorDocumentFolderModel>;
  @belongsTo('bestuurseenheid', { inverse: null, async: true })
  declare publisher: AsyncBelongsTo<BestuurseenheidModel>;

  @hasMany<EditorDocumentModel>('editor-document', {
    inverse: 'documentContainer',
    async: true,
  })
  declare revisions: AsyncHasMany<EditorDocumentModel>;
  @hasMany('attachment', {
    inverse: 'documentContainer',
    async: true,
  })
  declare attachments: AsyncHasMany<AttachmentModel>;
  @hasMany<EditorDocumentModel>('editor-document', {
    inverse: 'parts',
    async: true,
  })
  declare isPartOf: AsyncHasMany<EditorDocumentModel>;
}
