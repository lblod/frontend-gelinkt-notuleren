import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { EDITOR_FOLDERS } from '../../config/constants';
import { action } from '@ember/object';
import setupLoading from '../../utils/setupLoading';

export default class InboxTrashRoute extends Route {
  @service store;

  queryParams = {
    pageSize: { refreshModel: true },
    page: { refreshModel: true },
    sort: { refreshModel: true },
    filter: { refreshModel: true },
    // filter params
    title: { refreshModel: true },
  };

  model(params) {
    const options = {
      sort: params.sort,
      include: 'status,current-version',
      'filter[status][id]': EDITOR_FOLDERS.TRASH,
      page: {
        number: params.page,
        size: params.pageSize,
      },
    };

    if (params.title && params.title.length > 0)
      options['filter[current-version][title]'] = params.title;

    return this.store.query('document-container', options);
  }
  @action
  loading(transition) {
    // eslint-disable-next-line ember/no-controller-access-in-routes
    const controller = this.controllerFor(this.routeName);
    const result = setupLoading(transition, controller, this.routeName);
    return result;
  }
}
