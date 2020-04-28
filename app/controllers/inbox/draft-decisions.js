import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import DefaultQueryParamsMixin from 'ember-data-table/mixins/default-query-params';
import { computed } from '@ember/object';

export default Controller.extend(DefaultQueryParamsMixin, {
  currentSession: service(),
  sort: '-current-version.updated-on',

  actions: {
    openNewDocument() {
      this.transitionToRoute('draft-decisions.new');
    }
  }
});
