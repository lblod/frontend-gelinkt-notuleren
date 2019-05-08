import Controller from '@ember/controller';
import EditorDocumentBaseController from '../../mixins/editor-document-base-controller';
import { task, waitForProperty } from 'ember-concurrency';
import ENV from 'frontend-gelinkt-notuleren/config/environment';
import { warn } from '@ember/debug';
import { computed } from '@ember/object';

export default Controller.extend(EditorDocumentBaseController, {
  init() {
    this._super(...arguments);
    this.set('publicationUrl', ENV['publicatie']['baseUrl']);
  },

  hasPerformedSaveAndTransitionToEditModeTask: computed('isTransitioningToEditRoute.performCount', function(){
    return this.saveAndTransitionToEditMode.performCount > 0;
  }),

  saveAndTransitionToEditMode: task(function * (){
    let nearestNode = this.editor.currentNode.parentElement;
     let editorDocument = this.editorDocument;
     if(this.hasDocumentValidationErrors(editorDocument)){
       this.set('validationErrors', true);
       return;
     }
    let savedDoc = yield this.saveEditorDocument.perform(editorDocument, this.getStatusFor('conceptStatusId'));
    const container = yield savedDoc.get('documentContainer');
    this.transitionToRoute('editor-documents.edit', container.id);
  }),

  actions: {
    handleRdfaEditorInit(editor){
      if(editor){
         this.set('editor', editor);
         this.set('editorDomNode', editor.get('rootNode'));
         return;
       }
       this.set('editorDomNode', null);
    },
    save(){
      this.saveAndTransitionToEditMode.perform();
    }
  }
});
