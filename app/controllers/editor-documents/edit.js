import Controller from '@ember/controller';
import EditorDocumentBaseController from '../../mixins/editor-document-base-controller';

export default Controller.extend(EditorDocumentBaseController, {

  save: task(function *() {
    let nearestNode = this.editor.currentNode.parentElement;
    this.scrollToPlugin.addScrollToLocation(this.editor, nearestNode, 'last-save-position', true, false);
     let editorDocument = this.editorDocument;
     if(this.hasDocumentValidationErrors(editorDocument)){
       this.set('validationErrors', true);
       return;
     }
    yield this.saveEditorDocument(editorDocument);

    //Scroll to is done in next runloop.
    //Reason: basically, we have a spinner hiding everything.
    //The domNode of editor where it should scroll to is not visible. The scrolling does not work then.
    //I tried several different ways to make this smoother. But I couldn't
    next(() => { this.scrollToPlugin.scrollTo('last-save-position'); });
  }),
});
