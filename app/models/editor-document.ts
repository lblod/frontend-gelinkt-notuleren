import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import defaultContext from '../config/editor-document-default-context';
import { htmlSafe } from '@ember/template';
import type DocumentContainerModel from './document-container';
import type ConceptModel from './concept';

export default class EditorDocumentModel extends Model {
  @attr declare identifier: string;
  @attr declare uri: string;
  @attr declare title: string;
  @attr declare content: string;
  @attr('string', { defaultValue: defaultContext }) declare context: string;
  @attr('datetime') declare createdOn: Date;
  @attr('datetime') declare updatedOn: Date;

  @belongsTo('concept', { inverse: null, async: true })
  declare type: ConceptModel;
  @belongsTo('concept', { inverse: null, async: true })
  declare status: ConceptModel;
  @belongsTo('editor-document', { inverse: 'nextVersion', async: true })
  declare previousVersion: EditorDocumentModel;
  @belongsTo('editor-document', { inverse: 'previousVersion', async: true })
  declare nextVersion: EditorDocumentModel;
  @belongsTo('document-container', { inverse: 'revisions', async: true })
  declare documentContainer: DocumentContainerModel;

  @hasMany('document-container', { inverse: 'isPartOf', async: true })
  declare parts: DocumentContainerModel;

  get htmlSafeContent() {
    return htmlSafe(this.content);
  }
}
