import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { EDITOR_FOLDERS } from '../../config/constants';
export default class InboxIrgArchiveRoute extends Route {
  @service store;

  queryParams = {
    filter: { refreshModel: true },
    page: { refreshModel: true },
    sort: { refreshModel: true },
  };

  async model(params) {
    const options = {
      sort: params.sort,
      include: 'current-version',
      'filter[folder][:id:]': EDITOR_FOLDERS.IRG_ARCHIVE,
      page: {
        number: params.page,
      },
    };
    if (params.filter) {
      options['filter[current-version][title]'] = params.filter;
    }
    const result = await this.store.query('document-container', options);
    return result;
  }
}
