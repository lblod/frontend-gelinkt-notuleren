import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { EDITOR_FOLDERS } from '../../config/constants';

export default class InboxIrgArchiveRoute extends Route {
  @service store;

  queryParams = {
    page: { refreshModel: true },
    sort: { refreshModel: true },
    title: { refreshModel: true },
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
    if (params.title) {
      options['filter[current-version][title]'] = params.title;
    }
    return this.store.query('document-container', options);
  }
}
