import Controller from '@ember/controller';
import config from 'frontend-gelinkt-notuleren/config/environment';
import buildUrlFromConfig from '@lblod/ember-acmidm-login/utils/build-url-from-config';
const providerConfig = config.torii.providers['acmidm-oauth2'];

export default class LoginController extends Controller {
  loginUrl = buildUrlFromConfig(providerConfig);
}
