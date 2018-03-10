import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default Route.extend(DataTableRouteMixin, {
  modelName: 'zitting',
  mergeQueryOptions() {
    return {
      sort: '-geplande-start',
      include: 'agenda,behandelde-agendapunten,notulen,bestuursorgaan'
    };
  },
  afterModel(zittingen/*, transition*/) {
    if (zittingen.get('length') > 0) {
      this.transitionTo('published.zitting.agenda', zittingen.get('firstObject.id'));
    }
  }
});
