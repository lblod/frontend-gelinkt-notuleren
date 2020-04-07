import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default class DraftDecisionsNewRoute extends Route {
  model() {
    return RSVP.hash({
      editorDocument: this.store.createRecord('editor-document'),
      editorDocumentStatuses: this.store.findAll('editor-document-status'),
      editorDocumentFolders: this.store.findAll('editor-document-folder')
    });
  }
}
