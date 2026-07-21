import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class MockLoginRoute extends Route {
  @service session;
  @service store;

  queryParams = {
    page: {
      refreshModel: true,
    },
  };

  beforeModel() {
    this.session.prohibitAuthentication('index');
  }

  model() {
    return;
  }
}
