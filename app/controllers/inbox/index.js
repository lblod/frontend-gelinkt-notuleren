import { computed } from '@ember/object';
import Controller from '@ember/controller';
import DefaultQueryParamsMixin from 'ember-data-table/mixins/default-query-params';

export default Controller.extend(DefaultQueryParamsMixin, {
  statusIds: null,
  status: computed('statusIds', function() {
    return this.get('statusIds').join(',');
  }),
  init() {
    this._super(...arguments);
    this.set('statusIds', [
      'cfd751588a6c453296de9f9c0dff2af4',
      '627aec5d144c422bbd1077022c9b45d1',
      'b763390a63d548bb977fb4804293084a']);
  },
  actions: {
    toggleStar(document) {
      document.set('starred', !document.get('starred'));
      document.save();
    }
  }
});
