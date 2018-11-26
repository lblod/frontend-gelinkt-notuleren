import Controller from '@ember/controller';
import EditorDocumentBaseController from '../../mixins/editor-document-base-controller';
import { next } from '@ember/runloop';
import { task } from 'ember-concurrency';
import { observer } from '@ember/object';

export default Controller.extend(EditorDocumentBaseController, {
  queryParams: ['scrollToLastSavePosition'],
  scrollToLastSavePosition: null,

  save: task(function *() {
    let nearestNode = this.editor.currentNode.parentElement;
    this.scrollToPlugin.addScrollToLocation(this.editor, nearestNode, 'last-save-position', true, false);
     let editorDocument = this.editorDocument;
     if(this.hasDocumentValidationErrors(editorDocument)){
       this.set('validationErrors', true);
       return;
     }

    let savedDoc = yield this.saveEditorDocument(editorDocument);
    this.transitionToRoute('editor-documents.edit', savedDoc.id, {queryParams: { scrollToLastSavePosition: true } });
  }),

  actions: {
    handleRdfaEditorInit(editor){
     if(editor){
       this.set('editor', editor);
       this.set('editorDomNode', editor.get('rootNode'));
       if(this.scrollToLastSavePosition & this.scrollToPlugin){
         this.scrollToPlugin.scrollTo('last-save-position');
      }
       return;
     }
      this.set('editorDomNode', null);
    },

    save(){
     this.save.perform();
   }
  }
});
