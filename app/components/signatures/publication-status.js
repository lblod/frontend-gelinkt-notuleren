import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
export default class SignaturesPublicationStatus extends Component {
  @service intl;

  @tracked signedResources = [];
  @tracked publishedResource;
  @tracked ready = false;
  @action
  async loadResource() {
    if (!this.args.versionedResource) {
      this.signedResources = [];
      this.ready = true;
      return;
    }
    const versionedResource = await this.args.versionedResource;
    const signedResources = await versionedResource.signedResources;
    if (signedResources) {
      const activeSignedResources = signedResources.filter(
        (signature) => !signature.deleted,
      );
      this.signedResources = activeSignedResources;
    } else {
      this.signedResources = [];
    }
    this.publishedResource =
      await this.args.versionedResource.get('publishedResource');
    this.ready = true;
  }
  get publicationStatus() {
    if (this.publishedResource) {
      return { label: this.intl.t('publish.published'), color: 'action' };
    } else if (this.signedResources.length === 1) {
      return {
        label: this.intl.t('publish.first-signature-obtained'),
        color: 'warning',
      };
    } else if (this.signedResources.length === 2) {
      return { label: this.intl.t('publish.signed'), color: 'success' };
    } else {
      return { label: this.intl.t('publish.in-preparation') };
    }
  }
}
