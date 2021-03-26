import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default Route.extend(DataTableRouteMixin, {
  modelName: 'zitting',
  queryParams: {
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true  },
    filter: { refreshModel: true },
    // filter params
    title: { refreshModel: true }
  },
  mergeQueryOptions(params) {
    var sort;
    if(!params.sort){
      sort=params.sort;
    }
    else if(!params.sort.includes('geplande-start')){
      sort=params.sort+',-geplande-start';
    }
    return { sort: sort };
  }
});
