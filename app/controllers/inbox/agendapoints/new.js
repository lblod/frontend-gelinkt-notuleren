import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class InboxAgendapointsNewController extends Controller {
  @service router;
  @action
  redirectToAgendapoint(container) {
    this.router.transitionTo('agendapoints.edit', container.id);
  }

  @action
  cancelAgendapointCreation() {
    this.router.transitionTo('inbox.agendapoints');
  }
}
