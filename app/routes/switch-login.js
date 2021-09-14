import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class SwitchLoginRoute extends Route {
  @service() session;

  beforeModel(){
    this.session.prohibitAuthentication('index');
  }

  async model() {
    try {
      return await this.session.authenticate('authenticator:torii', 'acmidm-oauth2');
    }
    catch(e) {
      return 'Fout bij het aanmelden. Gelieve opnieuw te proberen.';
    }
  }
}

