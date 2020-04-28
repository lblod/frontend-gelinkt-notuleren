import Controller from '@ember/controller';
import EditorDocumentBaseController from '../../mixins/editor-document-base-controller';
import { task } from 'ember-concurrency';
import ENV from 'frontend-gelinkt-notuleren/config/environment';
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
    let editorDocument = this.editorDocument;
    if(this.hasDocumentValidationErrors(editorDocument)){
      this.set('validationErrors', true);
      return;
    }
    let savedDoc = yield this.saveEditorDocument.perform(editorDocument, this.getStatusFor('conceptStatusId'), this.getFolderFor('meetingMinutesId'));
    const container = yield savedDoc.get('documentContainer');
    this.transitionToRoute('editor-documents.edit', container.id);
  }),

  actions: {
    handleRdfaEditorInit(editor){
      this.set('editor', editor);
    },
    save(){
      this.saveAndTransitionToEditMode.perform();
    }
  }
});
