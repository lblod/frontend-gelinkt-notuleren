import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class AcmdidmLoginCompactComponent extends Component {
  @service session;
  @tracked errorMessage = '';
  @tracked isAuthenticating = false;

  @action
  login() {
    this.errorMessage = '';
    this.isAuthenticating = true;
    this.session.authenticate('authenticator:torii', 'acmidm-oauth2').catch(
      (reason) => {
        if (reason.status == 403) {
          this.errorMessage = 'U heeft geen toegang tot deze applicatie.';
        }
        else {
          this.errorMessage = 'Fout bij het aanmelden. Gelieve opnieuw te proberen.';
        }
      }
    ).finally(() => {
      this.isAuthenticating = false;
    });
  }
}
