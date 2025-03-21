import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { EDITOR_FOLDERS } from '../../config/constants';
import { action } from '@ember/object';
import setupLoading from '../../utils/setupLoading';

export default class InboxIrgArchiveRoute extends Route {
  @service store;

  queryParams = {
    page: { refreshModel: true },
    sort: { refreshModel: true },
    filter: { refreshModel: true },
  };

  async model(params) {
    const options = {
      sort: params.sort,
      include: 'current-version.type',
      'filter[folder][:id:]': EDITOR_FOLDERS.IRG_ARCHIVE,
      page: {
        number: params.page,
      },
    };
    if (params.filter) {
      options['filter[current-version][title]'] = params.filter;
    }
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
