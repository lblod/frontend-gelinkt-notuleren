import Controller from '@ember/controller';
import DefaultQueryParamsMixin from 'ember-data-table/mixins/default-query-params';

export default Controller.extend(DefaultQueryParamsMixin, {
  actions: {
    toggleStar(document) {
      document.set('starred', !document.get('starred'));
      document.save();
    }
  }
});
