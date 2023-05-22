import { inject as service } from '@ember/service';
import BaseSessionService from 'ember-simple-auth/services/session';
import config from 'frontend-gelinkt-notuleren/config/environment';

const providerConfig = config.torii.providers['acmidm-oauth2'];
export default class SessionService extends BaseSessionService {
  @service currentSession;

  handleAuthentication(routeAfterAuthentication) {
    super.handleAuthentication(routeAfterAuthentication);
    this.currentSession.load();
  }

  handleInvalidation() {
    const logoutUrl = providerConfig.logoutUrl;
    super.handleInvalidation(logoutUrl);
  }
}
