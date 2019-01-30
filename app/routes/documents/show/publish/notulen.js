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
      editorDocument: this.getEditorDocument( documentContainer ),
      versionedNotulen: documentContainer.versionedNotulen
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
      await this.controller.model.documentContainer.hasMany("versionedNotulen").reload();
      this.controller.set('model.versionedNotulen', await this.controller.model.documentContainer.versionedNotulen);
      this.controller.model.documentContainer.versionedNotulen.forEach( async (notulen) => {
        await notulen.reload();
        await notulen.hasMany("signedResources").reload();
        await notulen.belongsTo("publishedResource").reload();
      });

      this.refresh();
    }
  }
});
