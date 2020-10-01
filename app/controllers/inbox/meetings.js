import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import DefaultQueryParamsMixin from 'ember-data-table/mixins/default-query-params';
import { computed } from '@ember/object';

export default Controller.extend(DefaultQueryParamsMixin, {
  currentSession: service(),
  sort: '-geplande-start',
  init() {
    this._super(...arguments);
  },
  actions: {
    toggleStar(document) {
      document.set('starred', !document.get('starred'));
      document.save();
    },
    openNewDocument() {
      this.transitionToRoute('meetings.new');
    }
  }
});
