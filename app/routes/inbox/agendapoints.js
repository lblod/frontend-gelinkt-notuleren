import Route from '@ember/routing/route';
import { EDITOR_FOLDERS } from '../../config/constants';
import { service } from '@ember/service';
import {
  DRAFT_STATUS_ID,
  SCHEDULED_STATUS_ID,
  PUBLISHED_STATUS_ID,
} from '../../utils/constants';
import { action } from '@ember/object';
import setupLoading from '../../utils/setupLoading';

export default class InboxAgendapointsRoute extends Route {
  @service store;

  queryParams = {
    pageSize: { refreshModel: true },
    page: { refreshModel: true },
    sort: { refreshModel: true },
    filter: { refreshModel: true },
  };

  async model(params) {
    const options = {
      sort: params.sort,
      include: 'status,current-version',
      'filter[status][:id:]': `${DRAFT_STATUS_ID},${SCHEDULED_STATUS_ID},${PUBLISHED_STATUS_ID}`,
      'filter[folder][:id:]': EDITOR_FOLDERS.DECISION_DRAFTS,
      page: {
        number: params.page,
        size: params.pageSize,
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
