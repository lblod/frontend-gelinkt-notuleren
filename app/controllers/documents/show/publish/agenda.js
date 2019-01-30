import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  documentContainer: alias('model.documentContainer'),
  documentIdentifier: alias('model.documentIdentifier'),
  agendaContents: alias('model.agendaContents'),
  ajax: service(),

  ontwerpAgenda: computed('model.versionedAgendas', function() {
    return this.model.versionedAgendas.findBy( 'kind', 'ontwerpagenda' );
  }),

  aanvullendeAgenda: computed('model.versionedAgendas', function() {
    return this.model.versionedAgendas.findBy( 'kind', 'aanvullendeagenda' );
  }),

  spoedeisendeAgenda: computed('model.versionedAgendas', function() {
    return this.model.versionedAgendas.findBy( 'kind', 'spoedeisendeagenda' );
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
      await this.ajax.post(`/signing/agenda/sign/${kind}/${documentId}`);
      this.send("refreshModel");
    },
    /**
     * Publishes the document.
     */
    async publish(kind, documentId) {
      await this.ajax.post(`/signing/agenda/publish/${kind}/${documentId}`);
      this.send("refreshModel");
    }
  }
});
