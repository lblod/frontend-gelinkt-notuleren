import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
export default Route.extend({
  session: service('session'),
  async beforeModel() {
    if (this.session.isAuthenticated)
      this.transitionTo('inbox');
    else
      this.transitionTo('published');
  }
});
