import Controller from '@ember/controller';
import ENV from 'frontend-demo-editor/config/environment';

export default Controller.extend({
  init() {
    this._super(...arguments);
    this.set('header', ENV['vo-webuniversum']['header']);
    this.set('footer', ENV['vo-webuniversum']['footer']);
  },

  actions: {
    openNewDocument() {
      this.transitionToRoute('editor-documents.new');
    }
  }
});
