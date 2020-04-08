import Controller from '@ember/controller';
import EditorDocumentBaseController from '../../mixins/editor-document-base-controller';
import { task } from 'ember-concurrency';
import { computed } from '@ember/object';

export default Controller.extend(EditorDocumentBaseController, {
  hasPerformedSaveAndTransitionToEditModeTask: computed('isTransitioningToEditRoute.performCount', function(){
    return this.saveAndTransitionToEditMode.performCount > 0;
  }),

  saveAndTransitionToEditMode: task(function * (){
     let editorDocument = this.editorDocument;
     if(this.hasDocumentValidationErrors(editorDocument)){
       this.set('validationErrors', true);
       return;
     }
    let savedDoc = yield this.saveEditorDocument.perform(editorDocument, this.getStatusFor('conceptStatusId'), this.getFolderFor('draftDecisionsId'));
    const container = yield savedDoc.get('documentContainer');
    this.transitionToRoute('draft-decisions.edit', container.id);
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
