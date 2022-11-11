import Component from '@glimmer/component';
import config from 'frontend-gelinkt-notuleren/config/environment';
import buildUrlFromConfig from '@lblod/ember-acmidm-login/utils/build-url-from-config';
const providerConfig = config.torii.providers['acmidm-oauth2'];

export default class VoPageComponent extends Component {
  loginUrl = buildUrlFromConfig(providerConfig);
}
