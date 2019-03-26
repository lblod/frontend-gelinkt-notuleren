import { inject } from '@ember/service';
import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import Object from '@ember/object';
export default Route.extend({
  ajax: inject(),
  async model(){
    const documentContainer = this.modelFor('documents.show');
    const document = await this.getEditorDocument( documentContainer );
    return RSVP.hash({
      documentContainer: documentContainer,
      documentIdentifier: documentContainer.id,
      editorDocument: document,
      mockBehandelingen: this.ajax.request(`/prepublish/behandelingen/${document.id}`).then(
        (res) => res.data.map(
          (record) => Object.create(record.attributes)
        )
      )
    });
  },
  async getEditorDocument( documentContainer ) {
    const editorDocument = await documentContainer.get('currentVersion');
    return editorDocument;
  }
});
