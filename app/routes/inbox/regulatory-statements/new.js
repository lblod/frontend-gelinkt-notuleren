import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class InboxRegulatoryStatementsNewRoute extends Route {
  @service currentSession;
  @service router;

  beforeModel() {
    if (!this.currentSession.may('create-regulatory-statements')) {
      this.router.replaceWith('inbox.regulatory-statements');
    }
  }
}
