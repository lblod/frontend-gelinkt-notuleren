import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { EDITOR_FOLDERS } from '../config/constants';
export default class InboxRoute extends Route {
  @service session;
  @service currentSession;
  @service store;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
  }
  model() {
    const options = {
      'filter[folder][:id:]': EDITOR_FOLDERS.IRG_ARCHIVE,
      page: {
        number: 0,
        size: 1
      },
    };
    return this.store.query('document-container', options);
  }
}
