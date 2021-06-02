import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class MeetingsEditTreatmentRoute extends Route {
  @service currentSession;

  beforeModel() {
    if (!this.currentSession.canWrite) {
      this.transitionTo('meetings.edit');
    }
  }

  async model(params) {
    const treatment = await this.store.findRecord(
      'behandeling-van-agendapunt',
      params.treatment_id
    );
    return { treatment };
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.setup();
  }
}
