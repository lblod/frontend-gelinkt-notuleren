import Route from '@ember/routing/route';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import { roles } from 'frontend-gelinkt-notuleren/config/permissions';
import type CurrentSessionService from 'frontend-gelinkt-notuleren/services/current-session';

export default class IndexRoute extends Route {
  @service declare router: RouterService;
  @service declare currentSession: CurrentSessionService;

  beforeModel() {
    const roleRoute = roles.find((role) =>
      this.currentSession.roles.includes(role.name),
    )?.defaultRoute;
    if (roleRoute) {
      this.router.transitionTo(roleRoute);
      return;
    }

    this.router.transitionTo('inbox');
  }
}
