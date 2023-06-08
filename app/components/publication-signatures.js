import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class PublicationSignaturesComponent extends Component {
  @service currentSession;
  @service intl;

  get statusLabel() {
    if (this.signaturesCount === 1)
      return this.intl.t('publish.need-second-signature');
    else if (this.signaturesCount === 2) return this.intl.t('publish.signed');
    else return this.intl.t('publish.unsigned');
  }

  get statusSkin() {
    if (this.signaturesCount === 1) return 'warning';
    else if (this.signaturesCount === 2) return 'action';
    else return 'border';
  }

  get isSignedByCurrentUser() {
    if (this.activeSignatures && this.activeSignatures.length > 0) {
      const signature = this.activeSignatures.find((sig) => {
        return sig.gebruiker.get('id') === this.currentSession.user.get('id');
      });
      return !!signature;
    }
    return false;
  }
  get activeSignatures() {
    return this.args.signatures.filter((signature) => !signature.deleted);
  }

  get deletedSignatures() {
    return this.args.signatures.filter((signature) => signature.deleted);
  }

  get signaturesCount() {
    return this.activeSignatures.length;
  }
}
