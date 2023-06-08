import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { trackedFunction } from 'ember-resources/util/function';

export default class SignedResource extends Component {
  @tracked showDeleteSignatureCard = false;
  @service currentSession;
  @service store;

  @action
  toggleDeleteSignatureCard() {
    this.showDeleteSignatureCard = !this.showDeleteSignatureCard;
  }

  signedByCurrentUser = trackedFunction(this, async () => {
    const gebruiker = await this.args.signature.gebruiker;
    return gebruiker.id === this.currentSession.user.id;
  });

  @action
  async deleteSignature() {
    if (this.args.delete) {
      await this.args.delete();
      return;
    }
    const signature = this.args.signature;
    signature.deleted = true;
    //Check if versioned resource should be deleted
    let versionedResource;
    const agenda = await signature.agenda;
    if (agenda) {
      versionedResource = agenda;
    } else {
      const versionedBesluitenLijst = await signature.versionedBesluitenLijst;
      if (versionedBesluitenLijst) {
        versionedResource = versionedBesluitenLijst;
      } else {
        const versionedNotulen = await signature.versionedNotulen;
        if (versionedNotulen) {
          versionedResource = versionedNotulen;
        } else {
          const versionedBehandeling = await signature.versionedBehandeling;
          if (versionedBehandeling) {
            versionedResource = versionedBehandeling;
          }
        }
      }
    }
    const log = this.store.createRecord('publishing-log', {
      action: 'delete-signature',
      user: this.currentSession.user,
      date: new Date(),
      signedResource: signature,
      zitting: await versionedResource.zitting,
    });
    await log.save();
    const signedResources = await versionedResource.signedResources;
    const validSignedResources = signedResources.filter(
      (signature) => !signature.deleted
    );
    if (validSignedResources.length === 0) {
      versionedResource.deleted = true;
    }
    await versionedResource.save();
    await signature.save();
  }
}
