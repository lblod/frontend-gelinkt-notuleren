import Route from '@ember/routing/route';
import { service } from '@ember/service';

//Switch login callback route
export default class SwitchLoginRoute extends Route {
  @service session;
  @service router;

  beforeModel() {
    if (this.session.prohibitAuthentication('index')) {
      this.router.replaceWith('authorization.login');
    }
  }
}
