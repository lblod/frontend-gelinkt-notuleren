import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class MeetingsEditManualVotingRoute extends Route {
  @service currentSession;
  @service router;
  @service store;

  async model(params) {
    const behandeling = await this.store.findRecord(
      'behandeling-van-agendapunt',
      params.treatment_id,
    );
    return behandeling;
  }

  beforeModel() {
    if (!this.currentSession.canWrite) {
      this.router.transitionTo('meetings.edit');
    }
  }
}
