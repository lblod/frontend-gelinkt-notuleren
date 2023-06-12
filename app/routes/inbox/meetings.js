import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class InboxMeetingsRoute extends Route {
  @service store;

  queryParams = {
    pageSize: { refreshModel: true },
    page: { refreshModel: true },
    sort: { refreshModel: true },
    title: { refreshModel: true },
  };

  model(params) {
    const options = {
      sort: params.sort,
      page: {
        number: params.page,
        size: params.pageSize,
      },
    };

    return this.store.query('zitting', options);
  }
}
