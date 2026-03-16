import Model, { attr, belongsTo } from '@ember-data/model';
import type ConceptModel from './concept';
import type { AsyncBelongsTo } from '@ember-data/model';
import type DocumentContainerModel from './document-container';
import type FileModel from './file';
import type { Type } from '@warp-drive/core-types/symbols';

export default class AttachmentModel extends Model {
  declare [Type]: 'attachment';

  @attr decision?: string;

  @belongsTo<ConceptModel>('concept', { inverse: null, async: true })
  declare type: AsyncBelongsTo<ConceptModel>;
  @belongsTo<DocumentContainerModel>('document-container', {
    inverse: 'attachments',
    async: true,
  })
  declare documentContainer: AsyncBelongsTo<DocumentContainerModel>;
  @belongsTo<FileModel>('file', { inverse: null, async: true })
  declare file: AsyncBelongsTo<FileModel>;
}
