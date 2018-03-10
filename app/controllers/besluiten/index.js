import Controller from '@ember/controller';
import DefaultQueryParamsMixin from 'ember-data-table/mixins/default-query-params';

export default Controller.extend(DefaultQueryParamsMixin, {
  actions: {
    openBesluit(besluit) {
      this.transitionToRoute('besluiten.details', besluit.get('id'));
    }
  }
});
