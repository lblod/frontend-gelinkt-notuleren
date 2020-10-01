import Route from '@ember/routing/route';

export default class MeetingsEditRoute extends Route {
  async model(params) {
    var zitting=await this.store.findRecord('zitting', params.id);
    await zitting.agendapunten;
    zitting.agendapunten = zitting.agendapunten.sortBy('position');
    return zitting;
  }
}
