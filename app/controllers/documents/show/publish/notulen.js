import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  documentContainer: alias('model.documentContainer'),
  documentIdentifier: alias('model.documentIdentifier'),
  notulenContents: alias('model.notulenContents'),
  ajax: service(),

  ontwerpNotulen: computed('model.versionedNotulen', function() {
    return this.model.versionedNotulen.findBy( 'kind', 'ontwerpnotulen' );
  }),
  goedgekeurdeNotulen: computed('model.versionedNotulen', function() {
    return this.model.versionedNotulen.findBy( 'kind', 'goedgekeurdenotulen' );
  }),
  actions: {
    /**
     * Applies the signatature for "mayor" or "secretary".
     *
     * Assumes the current documentIdentifier is the one to be signed
     * as it is the one the user saw when trying to sign the agenda.
     * We should have support for removing the old signature of an
     * agenda but haven't implemented this so far.
     */
    async applySignature(kind, documentId) {
      this.set('ontwerpNotulenLoading', true);
      await this.ajax.post(`/signing/notulen/sign/${kind}/${documentId}`);
      this.send("refreshModel");
      this.set('ontwerpNotulenLoading', false);
    },
    /**
     * Publishes the document.
     */
    async publish(kind, documentId) {
      await this.ajax.post(`/signing/notulen/publish/${kind}/${documentId}`);
      this.send("refreshModel");
    }
  }
});

