import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import defaultContext from '../config/editor-document-default-context';
import { htmlSafe } from '@ember/template';

export default class EditorDocumentModel extends Model {
  @attr identifier;
  @attr uri;
  @attr title;
  @attr content;
  @attr('string', { defaultValue: defaultContext }) context;
  @attr('datetime') createdOn;
  @attr('datetime') updatedOn;

  @belongsTo('concept', { inverse: null, async: true }) type;
  @belongsTo('concept', { inverse: null, async: true }) status;
  @belongsTo('editor-document', { inverse: 'nextVersion', async: true })
  previousVersion;
  @belongsTo('editor-document', { inverse: 'previousVersion', async: true })
  nextVersion;
  @belongsTo('document-container', { inverse: 'revisions', async: true })
  documentContainer;

  @hasMany('document-container', { inverse: 'isPartOf', async: true }) parts;

  get htmlSafeContent() {
    return htmlSafe(this.content);
  }
}
