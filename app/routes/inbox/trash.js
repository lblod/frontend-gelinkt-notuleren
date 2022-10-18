import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { EDITOR_FOLDERS } from '../../config/constants';

export default class InboxTrashRoute extends Route {
  @service store;

  queryParams = {
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
    filter: { refreshModel: true },
    // filter params
    title: { refreshModel: true },
  };

  model(params) {
    const query = {
      include: 'status,current-version',
      'filter[status][id]': EDITOR_FOLDERS.TRASH,
    };

    if (params.title && params.title.length > 0)
      query['filter[current-version][title]'] = params.title;

    return this.store.query('document-container', query);
  }
}
