import { inject } from '@ember/service';
import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import PromiseProxyObject from 'frontend-gelinkt-notuleren/utils/promise-proxy-object';


export default Route.extend({
  ajax: inject(),
  async model(){
    const documentContainer = this.modelFor('documents.show');
    const document = await this.getEditorDocument( documentContainer );
    return RSVP.hash({
      documentContainer: documentContainer,
      documentIdentifier: documentContainer.id,
      editorDocument: document,
      behandelingen: this.ajax.request(`/prepublish/behandelingen/${document.id}`)
    });
  },
  async getEditorDocument( documentContainer ) {
    const editorDocument = await documentContainer.get('currentVersion');
    return editorDocument;
  },
  actions: {
    async refreshModel(){
      await this.controller.model.documentContainer.reload();
      this.controller.set('model.editorDocument', await this.getEditorDocument(this.controller.model.documentContainer));
      await this.controller.model.documentContainer.hasMany("versionedBehandelingen").reload();
      this.refresh();
    }
  }
});
