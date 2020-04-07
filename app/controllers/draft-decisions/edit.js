import Controller from '@ember/controller';
import EditorDocumentBaseController from '../../mixins/editor-document-base-controller';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';

export default Controller.extend(EditorDocumentBaseController, {
  store: service(),

  save: task(function *() {
     let editorDocument = this.editorDocument;
     if(this.hasDocumentValidationErrors(editorDocument)){
       this.set('validationErrors', true);
       return null;
     }

    const savedDoc = yield this.saveEditorDocument.perform(editorDocument);
    return savedDoc;
  }),

  exportHtml: task(function * () {
    // TODO
    return null;
  }),

  actions: {
    handleRdfaEditorInit(editor){
       this.set('editor', editor);
    },

    async exportHtml() {
      this.set('exportHtmlDisplay', false);
      await this.exportHtml.perform();
    },

    async save() {
      const savedDoc = await this.save.perform();
      this.set('editorDocument', savedDoc);
    },

    exportHtmlModal() {
      this.set('exportHtmlDisplay', true);
    },

    cancelSyncModal() {
      this.set('syncModalDisplay', false);
    }
  }
});
