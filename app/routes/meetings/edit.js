import Route from '@ember/routing/route';

export default class MeetingsEditRoute extends Route {

  async model(params) {
    const zitting = this.store.findRecord('zitting', params.id, { include: 'aanwezigen-bij-start,agendapunten' }); //include omits pagination
    zitting.agendapunten = zitting.agendapunten.sortBy('position');
    return zitting;
  }
}
