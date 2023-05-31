import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ENV from 'frontend-gelinkt-notuleren/config/environment';
import { buildLoginUrl, isValidAcmidmConfig } from '../../utils/acmidm';

export default class AuthorizationLoginRoute extends Route {
  @service router;
  @service session;

  beforeModel() {
    if (this.session.prohibitAuthentication('index')) {
      if (isValidAcmidmConfig(ENV.acmidm)) {
        window.location.replace(buildLoginUrl(ENV.acmidm));
      } else {
        this.router.replaceWith('mock-login');
      }
    }
  }
}
