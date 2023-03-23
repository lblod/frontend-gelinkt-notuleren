import { inject as service } from '@ember/service';
import Component from '@glimmer/component';

export default class PublicationPreviewComponent extends Component {
  @service currentSession;

  get statusSkin() {
    if (this.args.status === 'published') return 'action';
    else if (
      this.args.status === 'firstSignature' ||
      this.args.status === 'secondSignature'
    )
      return 'success';
    else return null;
  }

  get statusLabel() {
    if (this.args.status === 'published') return 'Publieke versie';
    else if (
      this.args.status === 'firstSignature' ||
      this.args.status === 'secondSignature'
    )
      return 'Ondertekende versie';
    else return 'Meest recente versie';
  }

  get administrativeUnitName() {
    return this.currentSession.group.naam.toLowerCase();
  }
}
