import RSVP from 'rsvp';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  currentSession: service(),

  async model(params){
    const bestuurseenheid = await this.get('currentSession.group');
    const container = await this.store.findRecord('document-container', params.id, { include: 'status' });
    return RSVP.hash({
      documentContainer: container,
      editorDocument: await container.get('currentVersion'),
      editorDocumentStatuses: await this.store.findAll('editor-document-status'),
    });
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('profile', draftDecisionsProfile);
  },

  actions: {
    error(error /*, transition */) {
      if (error.errors && error.errors[0].status === "404") {
        this.transitionTo('route-not-found');
      } else {
        // Let the route above this handle the error.
        return true;
      }
    }
  }
});
