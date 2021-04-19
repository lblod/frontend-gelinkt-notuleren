import Route from '@ember/routing/route';
export default class InboxIndexRoute extends Route {
  beforeModel() {
    this.transitionTo('inbox.meetings');
  }
}
