import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class RegulatoryStatementsRoute extends Route {
  @service session;
  @service features;
  @service router;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
    if (!this.features.isEnabled('regulatoryStatements')) {
      this.router.replaceWith('inbox.agendapoints');
    }
  }
}
