import Route from '@ember/routing/route';
import { EDITOR_FOLDERS } from '../../config/constants';
import { inject as service } from '@ember/service';

export default class InboxRegulatoryStatementsRoute extends Route {
  @service store;

  queryParams = {
    page: { refreshModel: true },
    sort: { refreshModel: true },
    filter: { refreshModel: true },
  };

  async model(params) {
    const options = {
      sort: params.sort,
      include: 'status,current-version',
      'filter[folder][:id:]': EDITOR_FOLDERS.REGULATORY_STATEMENTS,
      page: {
        number: params.page,
      },
    };
    if (params.filter) {
      options['filter[current-version][title]'] = params.filter;
    }
    return this.store.query('document-container', options);
  }
}
