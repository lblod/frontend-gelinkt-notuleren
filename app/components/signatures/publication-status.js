import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class SignaturesPublicationStatus extends Component {
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
        (signature) => !signature.deleted
      );
      this.signedResources = activeSignedResources;
    } else {
      this.signedResources = [];
    }
    this.publishedResource = await this.args.versionedResource.get(
      'publishedResource'
    );
    this.ready = true;
  }
  get publicationStatus() {
    if (this.publishedResource) {
      return { label: 'Gepubliceerd', color: 'action' };
    } else if (this.signedResources.length === 1) {
      return { label: 'Eerste ondertekening verkregen', color: 'warning' };
    } else if (this.signedResources.length === 2) {
      return { label: 'Getekend', color: 'success' };
    } else {
      return { label: 'In voorbereiding' };
    }
  }
}
