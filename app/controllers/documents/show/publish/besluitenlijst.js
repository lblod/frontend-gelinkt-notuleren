import { alias } from '@ember/object/computed';
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Controller.extend({
  ajax: service(),

  besluitenlijst: alias('model.versionedBesluitenLijsten.firstObject'),

  reload: task(function* () {
    yield this.model.documentContainer.hasMany('versionedBesluitenLijsten').reload();
    const versionedBesluitenLijsten = yield this.model.documentContainer.versionedBesluitenLijsten;
    this.set('model.versionedBesluitenLijsten', versionedBesluitenLijsten);
    this.model.documentContainer.versionedBesluitenLijsten.forEach( async (besluitenlijst) => {
      await besluitenlijst.hasMany('signedResources').reload();
      await besluitenlijst.belongsTo('publishedResource').reload();
    });
  }),

  actions: {
    /**
     * Applies the signatature for "mayor" or "secretary".
     *
     * Assumes the current documentIdentifier is the one to be signed
     * as it is the one the user saw when trying to sign the agenda.
     * We should have support for removing the old signature of a
     * besluitenlijst but haven't implemented this so far.
     */
    async sign(kind, documentId) {
      await this.ajax.post(`/signing/besluitenlijst/sign/${documentId}`);
      await this.reload.perform();
    },
    /**
     * Publishes the document.
     */
    async publish(kind, documentId) {
      await this.ajax.post(`/signing/besluitenlijst/publish/${documentId}`);
      await this.reload.perform();
    }
  }
});
