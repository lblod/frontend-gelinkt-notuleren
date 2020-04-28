import Controller from '@ember/controller';
import EditorDocumentBaseController from '../../mixins/editor-document-base-controller';
import { task } from 'ember-concurrency';
import ENV from 'frontend-gelinkt-notuleren/config/environment';
import { inject as service } from '@ember/service';

export default Controller.extend(EditorDocumentBaseController, {
  store: service(),
  init() {
    this._super(...arguments);
    this.set('publicationUrl', ENV['publicatie']['baseUrl']);
  },

  save: task(function *() {
    let editorDocument = this.editorDocument;
    if(this.hasDocumentValidationErrors(editorDocument)){
      this.set('validationErrors', true);
      return null;
    }

    const savedDoc = yield this.saveEditorDocument.perform(editorDocument);
    return savedDoc;
  }),

  archive: task(function *() {
    let editorDocument = this.editorDocument;
    if(this.hasDocumentValidationErrors(editorDocument)){
      this.set('validationErrors', true);
      return null;
    }

    const savedDoc = yield this.saveEditorDocument.perform(editorDocument,  this.getStatusFor('gearchiveerdStatusId'));
    return savedDoc;
  }),

  unarchive: task(function *() {
    let editorDocument = this.editorDocument;
    if(this.hasDocumentValidationErrors(editorDocument)){
      this.set('validationErrors', true);
      return null;
    }

    const savedDoc = yield this.saveEditorDocument.perform(editorDocument,  this.getStatusFor('actiefStatusId'));
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
      this.set('editor', editor);
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

    async archive() {
      const savedDoc = await this.archive.perform();
      this.set('editorDocument', savedDoc);
    },

    async unarchive() {
      const savedDoc = await this.unarchive.perform();
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
