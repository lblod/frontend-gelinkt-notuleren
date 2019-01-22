import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  documentContainer: alias('model.documentContainer'),
  documentIdentifier: alias('model.documentIdentifier'),
  agendaContents: alias('model.agendaContents'),
  ajax: service(),

  /**
   * Ensures the agenda is at the current documentIdentifier.
   */
  async reinitiateAgenda(){

  },

  ontwerpAgenda: computed('model.versionedAgendas', function() {
    return this.model.versionedAgendas.findBy( 'kind', 'ontwerpagenda' );
  }),

  aanvullendeAgenda: computed('model.versionedAgendas', function() {
    return this.model.versionedAgendas.findBy( 'kind', 'aanvullendeagenda' );
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
      console.log(`Applying signature ${kind} on ${documentId}`);
      // const response = await this.ajax.post(`/signing/agenda/sign/${kind}/${this.model.editorDocument.id}`);
      // return response;
    },
    /**
     * Publishes the document.
     */
    async publish(kind, documentId) {
      console.log(`Publishing ${kind} on ${documentId}`);
    }
  }
});
