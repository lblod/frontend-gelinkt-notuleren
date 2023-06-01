import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class InboxIndexRoute extends Route {
  @service router;

  beforeModel() {
    this.router.transitionTo('inbox.meetings');
  }
}
