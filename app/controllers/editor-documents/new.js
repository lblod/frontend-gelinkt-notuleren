import Controller from '@ember/controller';
import EditorDocumentBaseController from '../../mixins/editor-document-base-controller';
import { empty } from '@ember/object/computed';

export default Controller.extend(EditorDocumentBaseController, {
  showIntro: empty('editorDocument.content'),
  actions: {
    closeDialog() {
      this.set('showIntro', false);
    }
  }
});
