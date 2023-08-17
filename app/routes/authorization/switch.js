import Route from '@ember/routing/route';
import { service } from '@ember/service';
import ENV from 'frontend-gelinkt-notuleren/config/environment';
import { buildSwitchUrl } from '../../utils/acmidm';

export default class AuthorizationSwitchRoute extends Route {
  @service router;
  @service session;

  async beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');

    try {
      let wasMockLoginSession = this.session.isMockLoginSession;
      await this.session.invalidate();
      let logoutUrl = wasMockLoginSession
        ? this.router.urlFor('mock-login')
        : buildSwitchUrl(ENV.acmidm);

      window.location.replace(logoutUrl);
    } catch (error) {
      throw new Error(
        'Something went wrong while trying to remove the session on the server',
        {
          cause: error,
        },
      );
    }
  }
}
