import { htmlSafe } from '@ember/template';
import Model, {
  attr,
  belongsTo,
  hasMany,
  type AsyncBelongsTo,
  type AsyncHasMany,
} from '@ember-data/model';
import { type Type } from '@warp-drive/core-types/symbols';
import defaultContext from 'frontend-gelinkt-notuleren/config/editor-document-default-context';
import type DocumentContainerModel from './document-container';
import type ConceptModel from './concept';

export default class EditorDocumentModel extends Model {
  declare [Type]: 'editor-document';

  @attr declare identifier?: string | null;
  @attr declare uri?: string | null;
  @attr declare title?: string | null;
  @attr declare content?: string | null;
  @attr('string', { defaultValue: defaultContext }) declare context:
    | string
    | null;
  @attr('datetime') declare createdOn?: Date | null;
  @attr('datetime') declare updatedOn?: Date | null;

  @belongsTo('concept', { inverse: null, async: true })
  declare type: AsyncBelongsTo<ConceptModel>;
  @belongsTo('concept', { inverse: null, async: true })
  declare status: AsyncBelongsTo<ConceptModel>;
  @belongsTo<EditorDocumentModel>('editor-document', {
    inverse: 'nextVersion',
    async: true,
  })
  declare previousVersion: AsyncBelongsTo<EditorDocumentModel>;
  @belongsTo<EditorDocumentModel>('editor-document', {
    inverse: 'previousVersion',
    async: true,
  })
  declare nextVersion: AsyncBelongsTo<EditorDocumentModel>;
  @belongsTo<DocumentContainerModel>('document-container', {
    inverse: 'revisions',
    async: true,
  })
  declare documentContainer: AsyncBelongsTo<DocumentContainerModel>;

  @hasMany('document-container', { inverse: 'isPartOf', async: true })
  declare parts: AsyncHasMany<DocumentContainerModel>;

  get htmlSafeContent() {
    return htmlSafe(this.content ?? '');
  }
}
