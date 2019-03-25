import { inject } from '@ember/service';
import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  ajax: inject(),
  async model(){
    const documentContainer = this.modelFor('documents.show');
    const editorDocument = await documentContainer.get('currentVersion');
    return RSVP.hash({
      documentContainer: documentContainer,
      editorDocument: editorDocument,
      versionedAgendas: documentContainer.versionedAgendas
    });
  }
});
