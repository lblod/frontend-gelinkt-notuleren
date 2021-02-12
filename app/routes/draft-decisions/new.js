import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  model() {
    return RSVP.hash({
      editorDocument: this.store.createRecord('editor-document'),
      conceptStatus: this.store.findRecord('concept', 'a1974d071e6a47b69b85313ebdcef9f7'),
      draftFolder: this.store.findRecord('editor-document-folder', 'ae5feaed-7b70-4533-9417-10fbbc480a4c')
    });
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('profile', 'draftDecisionsProfile');
  }
});
