import Controller from '@ember/controller';
import ENV from 'frontend-gelinkt-notuleren/config/environment';
import { inject as service } from '@ember/service';

export default Controller.extend({
  currentSession: service(),

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
