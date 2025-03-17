import { htmlSafe } from '@ember/template';
import Model, {
  attr,
  belongsTo,
  hasMany,
  type AsyncBelongsTo,
  type AsyncHasMany,
} from '@ember-data/model';
import { type Type } from '@warp-drive/core-types/symbols';
import { type Option } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/option';
import defaultContext from 'frontend-gelinkt-notuleren/config/editor-document-default-context';
import type DocumentContainerModel from './document-container';
import type ConceptModel from './concept';

export default class EditorDocumentModel extends Model {
  declare [Type]: 'editor-document';

  @attr identifier: Option<string>;
  @attr uri: Option<string>;
  @attr title: Option<string>;
  @attr content: Option<string>;
  @attr('string', { defaultValue: defaultContext }) context: Option<string>;
  @attr('datetime') createdOn: Option<Date>;
  @attr('datetime') updatedOn: Option<Date>;

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
