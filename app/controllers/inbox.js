import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default Controller.extend({
  currentSession: service(),

  actions: {
    openNewDocument() {
      this.transitionToRoute('editor-documents.new');
    }
  }
});
