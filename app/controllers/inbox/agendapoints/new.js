import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class InboxAgendapointsNewController extends Controller {
  @service router;
  @service plausible;

  @action
  redirectToAgendapoint(container, chosenTemplate) {
    // Plausible Analytics: post custom event about the template used to create the agendapoint
    this.plausible.trackEvent('Create agendapoint', {
      templateTitle: chosenTemplate.get('title'),
    });
    this.router.transitionTo('agendapoints.edit', container.id);
  }

  @action
  cancelAgendapointCreation() {
    this.router.transitionTo('inbox.agendapoints');
  }
}
