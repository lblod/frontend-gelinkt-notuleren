import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  async model(params){
    const container = await this.store.findRecord('document-container', params.id, { include: 'status' });
    return RSVP.hash({
      documentContainer: container,
      editorDocument: await container.get('currentVersion'),
      editorDocumentStatuses: await this.store.findAll('editor-document-status'),
      editorDocumentFolders: await this.store.findAll('editor-document-folder')
    });
  }
});
