import RSVP from 'rsvp';
import Route from '@ember/routing/route';

export default Route.extend({
  async model(params){
    const container = await this.store.findRecord('document-container', params.id, { include: 'status' });
    return RSVP.hash({
      documentContainer: container,
      editorDocument: await container.get('currentVersion')
    });
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
