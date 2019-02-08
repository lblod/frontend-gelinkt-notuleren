import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import DefaultQueryParamsMixin from 'ember-data-table/mixins/default-query-params';

export default Controller.extend(DefaultQueryParamsMixin, {
  currentSession: service(),
  store: service(),
  actions: {
    async moveToConcepts(documents /*, datatable */) {
      const conceptStatus = await this.store.findRecord('editor-document-status', 'c02542af-e6be-4cc6-be60-4530477109fc');
      for (const document of documents) {
        document.set('status', conceptStatus);
        await document.save();
      }
      this.transitionToRoute('inbox.index');
    }
  }
});
