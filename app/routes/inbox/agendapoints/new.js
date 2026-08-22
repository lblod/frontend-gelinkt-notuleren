import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class InboxAgendapointsNewRoute extends Route {
  @service currentSession;
  @service router;

  beforeModel() {
    if (!this.currentSession.may('create-agendapoints')) {
      this.router.replaceWith('inbox.agendapoints');
    }
  }
}
