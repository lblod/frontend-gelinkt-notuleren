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
       return null;
     }

    const savedDoc = yield this.saveEditorDocument(editorDocument);
    return savedDoc;
  }),

  syncDocument: task(function * () {
    const savedDoc = yield this.save.perform();
    /*
     * THIS IS A HUGE PROBLEM: when saving and waiting for a second async task, the document fails.
     */
    this.store.createRecord('sync', { document: savedDoc }).save();
    return savedDoc;
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
      this.set('syncModalDisplay', false);
      const savedDoc = await this.syncDocument.perform();
      this.set('editorDocument', savedDoc);
    },
    async save(){
      const savedDoc = await this.save.perform();
      this.set('editorDocument', savedDoc);
    },

    startSyncModal(){
      this.set('syncModalDisplay', true);
    },

    cancelSyncModal(){
      this.set('syncModalDisplay', false);
    }
  }
});
