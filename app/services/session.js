import { inject as service } from '@ember/service';
import BaseSessionService from 'ember-simple-auth/services/session';
export default class SessionService extends BaseSessionService {
  @service currentSession;

  get isMockLoginSession() {
    return this.isAuthenticated
      ? this.data.authenticated.authenticator.includes('mock-login')
      : false;
  }

  async handleAuthentication(routeAfterAuthentication) {
    await this.currentSession.load();
    super.handleAuthentication(routeAfterAuthentication);
  }

  handleInvalidation() {
    // We handle invalidation in the routes themselves dependent on whether its a normal, switch or mock-login logout
  }
}
