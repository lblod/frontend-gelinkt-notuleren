import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class PublicationSignaturesComponent extends Component {
  @service currentSession;
  @service intl;

  get statusLabel() {
    if (this.args.signatures.length === 1)
      return this.intl.t('publish.need-second-signature');
    else if (this.args.signatures.length === 2)
      return this.intl.t('publish.signed');
    else return this.intl.t('publish.unsigned');
  }

  get statusSkin() {
    if (this.args.signatures.length === 1) return 'warning';
    else if (this.args.signatures.length === 2) return 'action';
    else return 'border';
  }

  get isSignedByCurrentUser() {
    if (this.args.signatures && this.args.signatures.length > 0) {
      const signature = this.args.signatures.find((sig) => {
        return sig.gebruiker.get('id') === this.currentSession.user.get('id');
      });
      return !!signature;
    }
    return false;
  }
}
