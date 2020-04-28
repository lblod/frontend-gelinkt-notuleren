import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  model() {
    return RSVP.hash({
      editorDocument: this.store.createRecord('editor-document'),
      editorDocumentStatuses: this.store.findAll('editor-document-status'),
      editorDocumentFolders: this.store.findAll('editor-document-folder')
    });
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('profile', 'draftDecisionsProfile');
  }
});
