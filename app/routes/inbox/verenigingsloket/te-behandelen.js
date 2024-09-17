import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class InboxVerenigingsloketTeBehandelenRoute extends Route {
  @service store;

  queryParams = {
    pageSize: { refreshModel: false },
    page: { refreshModel: false },
    sort: { refreshModel: false },
    filter: { refreshModel: false },
  };
}
