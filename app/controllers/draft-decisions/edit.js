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

  generateDocumentToDownload() {
    const context = JSON.parse(this.editorDocument.context);
    let prefixes = Object.entries(context.prefix).map(([key, value]) => {
      return `${key}: ${value}`;
    }).join(' ');
    const document = `
      <div vocab="${context.vocab}" prefix="${prefixes}" typeof="foaf:Document" resource="#">
        ${this.editor.htmlContent}
      </div>
    `;
    return document;
  },

  actions: {
    handleRdfaEditorInit(editor){
      this.set('editor', editor);
    },

    async save() {
      const savedDoc = await this.save.perform();
      this.set('editorDocument', savedDoc);
    },

    async archive() {
      const savedDoc = await this.archive.perform();
      this.set('editorDocument', savedDoc);
    },

    async unarchive() {
      const savedDoc = await this.unarchive.perform();
      this.set('editorDocument', savedDoc);
    },

    cancelSyncModal() {
      this.set('syncModalDisplay', false);
    },

    

    download() {
      const doc = this.generateDocumentToDownload();
      const title = this.editorDocument.title;
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(doc));
      element.setAttribute('download', `${title}.html`);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    }
  }
});
