import Model, { attr, belongsTo } from '@ember-data/model';
import defaultContext from '../config/editor-document-default-context';
import { htmlSafe } from '@ember/template';

export default class EditorDocumentModel extends Model {
  @attr uri;
  @attr title;
  @attr content;
  @attr('string', { defaultValue: defaultContext}) context;
  @attr('datetime') createdOn;
  @attr('datetime') updatedOn;
  @belongsTo('editor-document', {inverse: 'nextVersion'})
  previousVersion;
  @belongsTo('editor-document', {inverse: 'previousVersion'})
  nextVersion;
  @belongsTo('document-container', {inverse: 'revisions'})
  documentContainer;

  get htmlSafeContent() {
    return htmlSafe(this.content);
  }
}

