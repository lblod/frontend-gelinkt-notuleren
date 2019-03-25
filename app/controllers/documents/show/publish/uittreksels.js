import RSVP from 'rsvp';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import PromiseProxyObject from 'frontend-gelinkt-notuleren/utils/promise-proxy-object';

export default Controller.extend({
  documentContainer: alias('model.documentContainer'),
  documentIdentifier: alias('model.documentIdentifier'),
  currentEditorDocument: alias('model.editorDocument'),
  ajax: service(),
  behandelingen: computed('model.behandelingen.data.@each.uuid', function() {
    return this.get('model.behandelingen.data').map((b) => {
      const attr = b.attributes;
      attr.signedId = this.currentEditorDocument.id;
      attr.uri = attr.behandeling;
      if (attr.uuid) {
        // todo: not very clean, sorry
        attr.realBehandeling = this.store.find('versioned-behandeling', attr.uuid);
        return PromiseProxyObject.create( {
          promise: RSVP.hash(attr)
        });
      }
      else {
        return PromiseProxyObject.create( {
          promise: RSVP.hash(attr)
        });
      }
    });
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
    async applySignature(behandeling, documentId) {
      const encodedUri = encodeURIComponent(encodeURIComponent(behandeling)); // TODO need to double encode, figure out why
      await this.ajax.post(`/signing/behandeling/sign/${documentId}/${encodedUri}`);
    },
    /**
     * Publishes the document.
     */
    async publish(behandeling, documentId) {
      const encodedUri = encodeURIComponent(encodeURIComponent(behandeling)); // TODO need to double encode, figure out why
      await this.ajax.post(`/signing/behandeling/publish/${documentId}/${encodedUri}`);
    }
  }

});
