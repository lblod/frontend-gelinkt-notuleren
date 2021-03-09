import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default class AgendapointsShowRoute extends Route {
  async model(params) {
    const container = await this.store.findRecord('document-container', params.id, { include: 'status' });
    return RSVP.hash({
      documentContainer: container,
      editorDocument: await container.get('currentVersion')
    });
  }
}
