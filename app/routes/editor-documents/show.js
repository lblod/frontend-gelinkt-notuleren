import RSVP from 'rsvp';
import Route from '@ember/routing/route';

export default Route.extend({
  async model(params){
    const container = await this.store.findRecord('document-container', params.id, { include: 'status' });
    return RSVP.hash({
      documentContainer: container,
      editorDocument: container.get('currentVersion'),
      editorDocumentStatuses: this.store.findAll('editor-document-status'),
      editorDocumentFolders: this.store.findAll('editor-document-folder')
    });
  },

});
