import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  currentSession: service(),

  actions: {
    openNewDocument() {
      this.transitionToRoute('editor-documents.new');
    }
  }
});
