import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import ENV from 'frontend-gelinkt-notuleren/config/environment';

export default class PublicationPublishComponent extends Component {
  @service currentSession;

  publicationBaseUrl = ENV.publication.baseUrl;

  get bestuurseenheid() {
    return this.currentSession.group;
  }
}
