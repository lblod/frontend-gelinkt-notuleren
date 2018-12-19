import { alias } from '@ember/object/computed';
import Controller from '@ember/controller';

export default Controller.extend({
  documentContainer: alias('model.documentContainer'),
  documentIdentifier: alias('model.documentIdentifier'),
  agendaContents: alias('model.agendaContents'),

  /**
   * Ensures the agenda is at the current documentIdentifier.
   */
  async reinitiateAgenda(){

  },
  actions: {
    /**
     * Applies the signatature for "mayor" or "secretary".
     *
     * Assumes the current documentIdentifier is the one to be signed
     * as it is the one the user saw when trying to sign the agenda.
     * We should have support for removing the old signature of an
     * agenda but haven't implemented this so far.
     */
    applySignature( kind ) {
    },
    /**
     * Publishes the document.
     */
    publish() {
    }
  }
});
