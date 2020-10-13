import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default Route.extend(DataTableRouteMixin, {
  modelName: 'document-container',
  queryParams: {
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
    filter: { refreshModel: true },
    // filter params
    title: { refreshModel: true }
  },
  mergeQueryOptions(params) {
    const query = {
      include: 'status,current-version',
      'filter[status][:id:]': 'c02542af-e6be-4cc6-be60-4530477109fc', // actief
      'filter[folder][:id:]': '0239c9f9-d7eb-48d2-8195-00d2c281206b' // meeting minutes
    };

    if (params.title && params.title.length > 0)
      query['filter[current-version][title]'] = params.title;

    return query;
  }
});
