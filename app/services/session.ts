import { service } from '@ember/service';
import BaseSessionService from 'ember-simple-auth/services/session';
import type CurrentSessionService from './current-session';

interface ServiceData {
  authenticated: {
    authenticator: string;
    relationships: {
      account: { data: { id: string } };
      group: { data: { id: string } };
    };
    data: { attributes: { roles: string[] } };
  };
}

export default class SessionService extends BaseSessionService<ServiceData> {
  @service declare currentSession: CurrentSessionService;

  get isMockLoginSession() {
    return this.isAuthenticated
      ? this.data.authenticated.authenticator.includes('mock-login')
      : false;
  }

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async handleAuthentication(routeAfterAuthentication: string) {
    await this.currentSession.load();
    super.handleAuthentication(routeAfterAuthentication);
  }

  handleInvalidation() {
    // We handle invalidation in the routes themselves dependent on whether its a normal, switch or mock-login logout
  }
}
