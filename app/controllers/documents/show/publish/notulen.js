import { alias } from '@ember/object/computed';
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Controller.extend({
  ajax: service(),

  notulen: alias('model.versionedNotulen.firstObject'),

  reload: task(function* () {
    yield this.model.documentContainer.hasMany('versionedNotulen').reload();
    const versionedNotulen = yield this.model.documentContainer.versionedNotulen;
    this.set('model.versionedNotulen', versionedNotulen);
    this.model.documentContainer.versionedNotulen.forEach( async (notulen) => {
      await notulen.hasMany('signedResources').reload();
      await notulen.belongsTo('publishedResource').reload();
    });
  }),

  actions: {
    /**
     * Applies the signatature for "mayor" or "secretary".
     *
     * Assumes the current documentIdentifier is the one to be signed
     * as it is the one the user saw when trying to sign the notulen.
     * We should have support for removing the old signature of an
     * notulen but haven't implemented this so far.
     */
    async sign(kind, documentId) {
      await this.ajax.post(`/signing/notulen/sign/${kind}/${documentId}`);
      await this.reload.perform();
    },
    /**
     * Publishes the document.
     */
    async publish(kind, documentId) {
      await this.ajax.post(`/signing/notulen/publish/${kind}/${documentId}`);
      await this.reload.perform();
    }
  }
});
