import Controller from '@ember/controller';
import EditorDocumentBaseController from '../../mixins/editor-document-base-controller';
import { task } from 'ember-concurrency';
import ENV from 'frontend-gelinkt-notuleren/config/environment';
import { inject as service } from '@ember/service';

export default Controller.extend(EditorDocumentBaseController, {
  queryParams: ['scrollToLastSavePosition'],
  scrollToLastSavePosition: null,
  store: service(),
  init() {
    this._super(...arguments);
    this.set('publicationUrl', ENV['publicatie']['baseUrl']);
  },

  save: task(function *() {
    let nearestNode = this.editor.currentNode.parentElement;
    this.scrollToPlugin.addScrollToLocation(this.editor, nearestNode, 'last-save-position', true, false);
     let editorDocument = this.editorDocument;
     if(this.hasDocumentValidationErrors(editorDocument)){
       this.set('validationErrors', true);
       return;
     }

    const savedDoc = yield this.saveEditorDocument(editorDocument);
    return savedDoc;
  }),
  syncDocument: task(function * () {
    yield this.save.perform();
    const savedDoc = yield this.store.createRecord('sync', {document: this.editorDocument}).save();
    this.transitionToRoute('editor-documents.edit', savedDoc.id, {queryParams: { scrollToLastSavePosition: true } });
  }),
  actions: {

    handleRdfaEditorInit(editor){
     if(editor){
       this.set('editor', editor);
       this.set('editorDomNode', editor.get('rootNode'));
       if(this.scrollToLastSavePosition && this.scrollToPlugin){
         this.scrollToPlugin.scrollTo('last-save-position');
       }
       this.set('scrollToLastSavePosition', null);
       return;
     }
      this.set('editorDomNode', null);
    },

    async syncDocument() {
      await this.syncDocument.perform();
    },
    async save(){
      const savedDoc = await this.save.perform();
      this.transitionToRoute('editor-documents.edit', savedDoc.id, {queryParams: { scrollToLastSavePosition: true } });
   }
  }
});
