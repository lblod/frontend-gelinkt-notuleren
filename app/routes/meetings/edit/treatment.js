import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class MeetingsEditTreatmentRoute extends Route {
  @service intl;

  async model(params) {
    const treatment = await this.store.findRecord(
      'behandeling-van-agendapunt',
      params.treatment_id
    );
    return {
      treatment,
      meetingId: this.paramsFor('meetings.edit').id,
    };
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.setup();
  }
}
