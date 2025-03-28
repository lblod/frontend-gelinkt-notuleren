import Route from '@ember/routing/route';
import { EDITOR_FOLDERS } from '../../config/constants';
import { service } from '@ember/service';
import setupLoading from '../../utils/setupLoading';
import { action } from '@ember/object';

export default class InboxRegulatoryStatementsRoute extends Route {
  @service store;
  @service features;
  @service router;

  queryParams = {
    pageSize: { refreshModel: true },
    page: { refreshModel: true },
    sort: { refreshModel: true },
    filter: { refreshModel: true },
  };

  beforeModel(/*transition*/) {
    if (!this.features.isEnabled('regulatoryStatements')) {
      this.router.replaceWith('inbox.agendapoints');
    }
  }

  async model(params) {
    const options = {
      sort: params.sort,
      include: 'current-version,current-version.status',
      'filter[folder][:id:]': EDITOR_FOLDERS.REGULATORY_STATEMENTS,
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
