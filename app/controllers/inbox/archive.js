import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import DefaultQueryParamsMixin from 'ember-data-table/mixins/default-query-params';

export default Controller.extend(DefaultQueryParamsMixin, {
  currentSession: service(),
  sort: '-current-version.updated-on',

  actions: {
    toggleStar(document) {
      document.set('starred', !document.get('starred'));
      document.save();
    }
  }
});
