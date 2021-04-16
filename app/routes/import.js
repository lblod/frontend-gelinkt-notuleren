import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ImportRoute extends Route {
  @service session;

  queryParams = {
    mock: { refreshModel: true },
    source: { refreshModel: true },
  };

  beforeModel(transition) {
    let loginRoute = transition.to.queryParams.mock ? 'mock-login' : 'login';
    this.session.requireAuthentication(transition, loginRoute);
  }
}
