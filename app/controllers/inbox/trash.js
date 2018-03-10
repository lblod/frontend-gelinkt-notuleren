import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import DefaultQueryParamsMixin from 'ember-data-table/mixins/default-query-params';

export default Controller.extend(DefaultQueryParamsMixin, {
  store: service(),
  actions: {
    async moveToConcepts(documents, datatable) {
      const conceptStatus = await this.get('store').findRecord('editor-document-status', 'cfd751588a6c453296de9f9c0dff2af4');
      documents.forEach(function(document) {
        document.set('status', conceptStatus);
        document.save();
      });
      datatable.clearSelection();
      this.transitionToRoute('inbox.index');
    },
    toggleStar(document) {
      document.set('starred', !document.get('starred'));
      document.save();
    }
  }
});
