import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import ENV from 'frontend-gelinkt-notuleren/config/environment';

export default class SignaturesPublicationConfirmation extends Component {
  @service currentSession;
  publicationBaseUrl = ENV.publication.baseUrl;
}
