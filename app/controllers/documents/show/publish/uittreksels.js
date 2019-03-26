import RSVP from 'rsvp';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import PromiseProxyObject from 'frontend-gelinkt-notuleren/utils/promise-proxy-object';
import { task } from 'ember-concurrency';
export default Controller.extend({
  documentContainer: alias('model.documentContainer'),
  documentIdentifier: alias('model.documentIdentifier'),
  currentEditorDocument: alias('model.editorDocument'),
  ajax: service(),
  behandelingen: computed('model.mockBehandelingen.@each.uuid', function() {
    return this.get('model.mockBehandelingen').map((attr) => {
      attr.signedId = this.currentEditorDocument.id;
      attr.uri = attr.behandeling;
      if (attr.uuid) {
        // todo: this could generate a lot of requests
        const realBehandeling = this.store.find('versioned-behandeling', attr.uuid);
        attr.realBehandeling = realBehandeling;
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
  reload: task(function* (behandelingUri, documentId) {
    const mockBehandeling = this.model.mockBehandelingen.find((mock) => mock.behandeling === behandelingUri);
    if (mockBehandeling.uuid) {
      // versionedBehandeling already existed, just refresh it
      const realBehandeling = yield this.store.find('versioned-behandeling', mockBehandeling.uuid);
      realBehandeling.hasMany('signedResources').reload();
      realBehandeling.belongsTo('publishedResource').reload();
    }
    else {
      // versionedBehandeling was just created
      const res = yield this.store.query('versioned-behandeling', {
        filter: {
          behandeling: {':uri:': behandelingUri},
          "editor-document": {':id:': documentId  }
        }
      });
      if (res.length === 1) {
        mockBehandeling.set('uuid', res.firstObject.id);
      }
    }
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
      await this.reload.perform(behandeling, documentId);
    },
    /**
     * Publishes the document.
     */
    async publish(behandeling, documentId) {
      const encodedUri = encodeURIComponent(encodeURIComponent(behandeling)); // TODO need to double encode, figure out why
      await this.ajax.post(`/signing/behandeling/publish/${documentId}/${encodedUri}`);
      await this.reload.perform(behandeling, documentId);
    }
  }

});
