import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class SignaturesSignatureConfirmation extends Component {
  @service currentSession;
  @tracked name;
  @tracked mockDocument;
  @tracked confirm;
  @tracked cancel;
}
