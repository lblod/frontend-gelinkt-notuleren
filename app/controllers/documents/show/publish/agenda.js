import { computed } from '@ember/object';
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Controller.extend({
  ajax: service(),

  ontwerpAgenda: computed('model.versionedAgendas.@each.kind', function() {
    return this.model.versionedAgendas.findBy( 'kind', 'ontwerpagenda' );
  }),

  aanvullendeAgenda: computed('model.versionedAgendas.@each.kind', function() {
    return this.model.versionedAgendas.findBy( 'kind', 'aanvullendeagenda' );
  }),

  spoedeisendeAgenda: computed('model.versionedAgendas.@each.kind', function() {
    return this.model.versionedAgendas.findBy( 'kind', 'spoedeisendeagenda' );
  }),

  reload: task(function* () {
    yield this.model.documentContainer.hasMany('versionedAgendas').reload();
    const versionedAgendas = yield this.model.documentContainer.versionedAgendas;
    this.set('model.versionedAgendas', versionedAgendas);
    this.model.documentContainer.versionedAgendas.forEach( async (agenda) => {
      await agenda.hasMany('signedResources').reload();
      await agenda.belongsTo('publishedResource').reload();
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
    async sign(kind, documentId) {
      await this.ajax.post(`/signing/agenda/sign/${kind}/${documentId}`);
      await this.reload.perform();
    },
    /**
     * Publishes the document.
     */
    async publish(kind, documentId) {
      await this.ajax.post(`/signing/agenda/publish/${kind}/${documentId}`);
      await this.reload.perform();
    }
  }
});
