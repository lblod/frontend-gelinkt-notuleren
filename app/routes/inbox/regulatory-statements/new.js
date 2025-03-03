import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class InboxRegulatoryStatementsNewRoute extends Route {
  @service currentSession;
  @service router;

  beforeModel() {
    if (!this.currentSession.canWrite) {
      this.router.replaceWith('inbox.regulatory-statements');
    }
  }
}
