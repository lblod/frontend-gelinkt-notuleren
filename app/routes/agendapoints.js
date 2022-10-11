import RSVP from 'rsvp';
import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class AgendapointsRoute extends Route {
  @service session;
  @service store;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
  }

  async model(params) {
    const container = await this.store.findRecord(
      'document-container',
      params.id,
      { include: 'status' }
    );

    return RSVP.hash({
      documentContainer: container,
      editorDocument: await container.get('currentVersion'),
    });
  }

  @action
  error(error /*, transition */) {
    if (error.errors && error.errors[0].status === '404') {
      this.router.transitionTo('route-not-found');
    } else {
      // Let the route above this handle the error.
      return true;
    }
  }
}
