import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class InboxMeetingsRoute extends Route {
  @service store;

  queryParams = {
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
    title: { refreshModel: true },
  };

  model(params) {
    console.log('hererererere', this);
    const options = {
      sort: params.sort,
      page: {
        number: params.page,
        size: params.size,
      },
    };

    if (!params.sort) {
      options.sort = params.sort;
    } else if (!params.sort.includes('geplande-start')) {
      options.sort = params.sort + ',-geplande-start';
    } else {
      options.sort = params.sort;
    }

    return this.store.query('zitting', options);
  }
}
