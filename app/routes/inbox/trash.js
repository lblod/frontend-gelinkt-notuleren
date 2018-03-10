import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default Route.extend(DataTableRouteMixin, {
  modelName: 'editor-document',
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
      include: 'status',
      'filter[:has-no:next-version]': 'true',
      'filter[status][id]': '5A8304E8C093B00009000010' // trash
    };

    if (params.title && params.title.length > 0)
      query['filter[title]'] = params.title;

    return query;
  }
});
