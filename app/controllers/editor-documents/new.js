import Controller from '@ember/controller';
import EditorDocumentBaseController from '../../mixins/editor-document-base-controller';
import { empty } from '@ember/object/computed';

export default Controller.extend(EditorDocumentBaseController, {
  showIntro: empty('editorDocument.content'),
  actions: {

    async save(){
      let editorDocument = this.get('editorDocument');

     if(this.hasDocumentValidationErrors(editorDocument)){
       this.set('validationErrors', true);
       return;
     }

     await this.saveEditorDocument(editorDocument, this.getStatusFor('conceptStatusId'));
     this.transitionToRoute('/editor-documents/' + editorDocument.get('id') + '/edit');
    },

    closeDialog() {
      this.set('showIntro', false);
    }
  }
});
