import { inject } from '@ember/service';
import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  ajax: inject(),
  model(){
    const documentContainer = this.modelFor('documents.show');
    return RSVP.hash({
      documentContainer: documentContainer,
      documentIdentifier: documentContainer.id,
      editorDocument: this.getEditorDocument( documentContainer )
    });
  },
  async getEditorDocument( documentContainer ) {
    const editorDocument = await documentContainer.get('currentVersion');
    return editorDocument;
  }
});
