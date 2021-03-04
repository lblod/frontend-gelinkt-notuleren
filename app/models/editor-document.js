import Model, { attr, belongsTo } from '@ember-data/model';
import defaultContext from '../config/editor-document-default-context';

export default Model.extend({
  uri: attr(),
  title: attr(),
  content: attr(),
  context: attr('string', { defaultValue: defaultContext}),
  createdOn: attr('datetime'),
  updatedOn: attr('datetime'),
  starred: attr(),
  origin: attr(),
  previousVersion: belongsTo('editor-document', {inverse: 'nextVersion'}),
  nextVersion: belongsTo('editor-document', {inverse: 'previousVersion'}),
  documentContainer: belongsTo('document-container', {inverse: 'revisions'})
});
