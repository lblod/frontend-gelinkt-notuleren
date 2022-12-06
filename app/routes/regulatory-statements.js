import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class RegulatoryStatementsRoute extends Route {
  @service session;
  @service features;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
    if (!this.features.isEnabled('regulatoryStatements')) {
      this.replaceWith('agendapoints');
    }
  }
}
