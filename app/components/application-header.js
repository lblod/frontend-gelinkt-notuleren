import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import config from 'frontend-gelinkt-notuleren/config/environment';
import buildUrlFromConfig from '@lblod/ember-acmidm-login/utils/build-url-from-config';
const providerConfig = config.torii.providers['acmidm-oauth2'];
export default class ApplicationHeaderComponent extends Component {
  loginUrl = buildUrlFromConfig(providerConfig);

  @service currentSession;
  @service session;
  @action
  logout() {
    this.session.invalidate();
  }
}
