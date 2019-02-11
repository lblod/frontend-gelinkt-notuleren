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
      versionedBesluitenLijsten: documentContainer.versionedBesluitenLijsten
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
      await this.controller.model.documentContainer.hasMany("versionedBesluitenLijsten").reload();
      this.controller.set('model.versionedBesluitenLijsten', await this.controller.model.documentContainer.versionedBesluitenLijsten);
      this.controller.model.documentContainer.versionedBesluitenLijsten.forEach( async (notulen) => {
        await notulen.reload();
        await notulen.hasMany("signedResources").reload();
        await notulen.belongsTo("publishedResource").reload();
      });
      this.refresh();
    }
  }
});
