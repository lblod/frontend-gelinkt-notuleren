import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class PublicationPreviewComponent extends Component {
  @service intl;
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
    if (this.args.status === 'published') {
      return this.intl.t('publish.public-version');
    } else if (this.args.status === 'firstSignature') {
      return this.intl.t('publish.need-second-signature');
    } else if (this.args.status === 'secondSignature')
      return this.intl.t('publish.signed-version');
    else return '';
  }
}
