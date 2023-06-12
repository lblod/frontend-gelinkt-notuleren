import Route from '@ember/routing/route';
import { service } from '@ember/service';
export default class AgendapointsRoute extends Route {
  @service session;
  @service store;
  @service router;

  queryParams = {
    returnToMeeting: { refreshModel: true },
  };

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
  }

  async model(params) {
    const container = await this.store.findRecord(
      'document-container',
      params.id,
      { include: 'status' }
    );

    return {
      documentContainer: container,
      returnToMeeting: params.returnToMeeting,
    };
  }
}
