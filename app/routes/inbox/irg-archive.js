import Route from '@ember/routing/route';
import {inject as service } from '@ember/service';

export default class InboxIrgArchiveRoute extends Route {
  @service store;

  queryParams = {
    filter: { refreshModel: true },
    page: { refreshModel: true },
    sort: { refreshModel: true },
  }

  async model(params) {
    const options = {
      sort: params.sort,
      include: 'current-version',
      'filter[folder][:id:]': '17b39ab5-9da6-42fd-8568-2b1a848cd21c', // decision drafts
      page: {
        number: params.page
      }
    };
    if (params.filter) {
      options['filter[current-version][title]'] = params.filter;
    }
    return this.store.query('document-container', options);
  }
}
