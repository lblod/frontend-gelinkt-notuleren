import { inject as service } from '@ember/service';
import BaseSessionService from 'ember-simple-auth/services/session';
import ENV from 'frontend-gelinkt-notuleren/config/environment';

export default class SessionService extends BaseSessionService {
  @service currentSession;

  handleAuthentication(routeAfterAuthentication) {
    super.handleAuthentication(routeAfterAuthentication);
    this.currentSession.load();
  }

  handleInvalidation() {
    const logoutUrl = ENV['torii']['providers']['acmidm-oauth2']['logoutUrl'];
    super.handleInvalidation(logoutUrl);
  }
}
