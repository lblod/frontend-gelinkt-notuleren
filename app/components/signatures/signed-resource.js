import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class SignedResource extends Component {
  @tracked showDeleteSignatureCard = false;
  @service currentSession;
  @service store;

  @action
  toggleDeleteSignatureCard() {
    this.showDeleteSignatureCard = !this.showDeleteSignatureCard;
  }

  @action
  async deleteSignature() {
    const signature = this.args.signature;
    signature.deleted = true;
    //Check if versioned resource should be deleted
    let versionedResource;
    if (await signature.agenda) {
      versionedResource = await signature.agenda;
    } else if (await signature.versionedBesluitenLijst) {
      versionedResource = await signature.versionedBesluitenLijst;
    } else if (await signature.versionedNotulen) {
      versionedResource = await signature.versionedNotulen;
    } else if (await signature.versionedBehandeling) {
      versionedResource = await signature.versionedBehandeling;
    }
    if (versionedResource.get('publishedResource').get('id')) {
      await signature.save();
      return;
    }
    const signedResources = versionedResource.get('signedResources');
    const validSignedResources = signedResources.filter(
      (signature) => !signature.deleted
    );
    if (validSignedResources.length === 0) {
      versionedResource.deleted = true;
    }
    await versionedResource.save();
    await signature.save();
    const log = this.store.createRecord('publishing-log', {
      action: 'delete-signature',
      user: this.currentSession.user,
      date: new Date(),
      signedResource: signature,
      zitting: await versionedResource.get('zitting'),
    });
    await log.save();
  }
}
