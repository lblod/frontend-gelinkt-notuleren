import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import ENV from 'frontend-gelinkt-notuleren/config/environment';

export default class SignaturesPublicationConfirmation extends Component {
  @service currentSession;
  publicationBaseUrl = ENV.publication.baseUrl;

  get administrativeUnitName() {
    return this.currentSession.group.naam.toLowerCase();
  }
}
