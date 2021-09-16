import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class InboxAgendapointsNewRoute extends Route {
  @service currentSession;
  @service router;

  beforeModel() {
    if (!this.currentSession.canWrite) {
      this.router.replaceWith('inbox.agendapoints');
    }
  }
}
