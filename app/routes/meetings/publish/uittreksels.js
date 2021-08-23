import Route from '@ember/routing/route';

export default class MeetingsPublishUittrekselsRoute extends Route {
  model() {
    return this.modelFor("meetings.publish"); // assumes it has agendapoints preloaded
  }
}
