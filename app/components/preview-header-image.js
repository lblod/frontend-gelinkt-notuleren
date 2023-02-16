import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class PreviewHeaderImageComponent extends Component {
  @service currentSession;

  get url() {
    return this.currentSession.groupLogoUrl;
  }
}
