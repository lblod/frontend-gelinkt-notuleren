import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { EDITOR_FOLDERS } from '../../config/constants';

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
}
