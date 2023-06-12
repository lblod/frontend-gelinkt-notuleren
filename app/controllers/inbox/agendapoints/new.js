import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { EDITOR_FOLDERS } from 'frontend-gelinkt-notuleren/config/constants';

export default class InboxAgendapointsNewController extends Controller {
  @service router;
  @service plausible;

  folderId = EDITOR_FOLDERS.DECISION_DRAFTS;

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

  get templateOptions() {
    return this.model;
  }
}
