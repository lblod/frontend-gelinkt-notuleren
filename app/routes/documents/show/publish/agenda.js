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
      versionedAgendas: documentContainer.versionedAgendas
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
      await this.controller.model.documentContainer.hasMany("versionedAgendas").reload();
      this.controller.set('model.versionedAgendas', await this.controller.model.documentContainer.versionedAgendas);
      this.controller.model.documentContainer.versionedAgendas.forEach( async (agenda) => {
        await agenda.reload();
        await agenda.hasMany("signedResources").reload();
        await agenda.belongsTo("publishedResource").reload();
      });

      this.refresh();
    }
  }
});
