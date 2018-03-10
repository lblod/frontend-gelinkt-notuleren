import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default Route.extend(DataTableRouteMixin, {
  modelName: 'besluit',
  queryParams: {
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
    filter: { refreshModel: true }
  },
  mergeQueryOptions() {
    return {
//      include: 'status',
//      'filter[:has-no:next-version]': 'true',
      //      'filter[status]': params.status
      sort:'-publicatiedatum'
    };
  }
});
