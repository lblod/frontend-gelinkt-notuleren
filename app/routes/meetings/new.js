import Route from '@ember/routing/route';

export default class MeetingsNewRoute extends Route {
  model(){
    const now = new Date();
    return this.store.createRecord('zitting', {
      geplandeStart: now,
      gestartOpTijdstip: now,
      geeindigdOpTijdstip: now
    });
  }
}
