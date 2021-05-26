import Controller from '@ember/controller';
import ENV from 'frontend-gelinkt-notuleren/config/environment';

export default class LoginController extends Controller {
  manualBaseUrl = ENV.manual.baseUrl;
}
