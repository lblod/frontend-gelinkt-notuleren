import Controller from '@ember/controller';

export default Controller.extend({

  actions: {
    openNewDocument() {
      this.transitionToRoute('editor-documents.new');
    }
  }
});
