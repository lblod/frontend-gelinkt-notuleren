import Route from '@ember/routing/route';
import { EDITOR_FOLDERS } from '../../config/constants';
import { inject as service } from '@ember/service';

export default class InboxAgendapointsRoute extends Route {
  @service store;

  queryParams = {
    page: { refreshModel: true },
    sort: { refreshModel: true },
    size: { refreshModel: true },
    title: { refreshModel: true },
  };

  async model(params) {
    const options = {
      sort: params.sort,
      include: 'status,current-version',
      'filter[status][:id:]':
        'a1974d071e6a47b69b85313ebdcef9f7,7186547b61414095aa2a4affefdcca67,ef8e4e331c31430bbdefcdb2bdfbcc06', // concept, geagendeerd or published
      'filter[folder][:id:]': EDITOR_FOLDERS.DECISION_DRAFTS,
      page: {
        number: params.page,
        size: params.size,
      },
    };
    if (params.title) {
      options['filter[current-version][title]'] = params.title;
    }
    return this.store.query('document-container', options);
  }
}
