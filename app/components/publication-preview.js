import Component from '@glimmer/component';

export default class PublicationPreviewComponent extends Component {
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
}
