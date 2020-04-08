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

  actions: {
    handleRdfaEditorInit(editor){
      this.set('editor', editor);
    },

    async save() {
      const savedDoc = await this.save.perform();
      this.set('editorDocument', savedDoc);
    },

    cancelSyncModal() {
      this.set('syncModalDisplay', false);
    },

    download() {
      const doc = this.editor.htmlContent
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(doc));
      element.setAttribute('download', 'document.html');

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    }
  }
});
