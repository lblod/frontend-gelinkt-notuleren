import Route from '@ember/routing/route';
import { computed } from '@ember/object';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
  queryParams: {
    mock: { refreshModel: true },
    source: { refreshModel: true }
  },

  beforeModel(transition) {
    this.set('mock', transition.to.queryParams.mock);
    this._super(...arguments);
  },

  authenticationRoute: computed('mock', function() {
    if (this.mock) {
      return 'mock-login';
    }
    else {
      return 'login'; // TODO read from configuration
    }
  })
});
