import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { action } from '@ember/object';
import setupLoading from '../../utils/setupLoading';

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
  @action
  loading(transition) {
    // eslint-disable-next-line ember/no-controller-access-in-routes
    const controller = this.controllerFor(this.routeName);
    const result = setupLoading(transition, controller, this.routeName);
    return result;
  }
}
