import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class AuthorizationCallbackRoute extends Route {
  @service session;

  queryParams = {
    code: {
      refreshModel: true,
    },
  };

  beforeModel() {
    // redirect to index if already authenticated
    this.session.prohibitAuthentication('index');
  }

  async model(params) {
    this.session.authenticate('authenticator:acm-idm', params.code);
  }
}
