import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class MeetingsEditManualVotingRoute extends Route {
  @service currentSession;
  @service router;
  @service store;

  async model(params) {
    const voting = await this.store.findRecord(
      'custom-voting',
      params.voting_id,
      {
        include: 'voting-document.current-version',
      },
    );
    console.log(voting);
    return voting;
  }

  beforeModel() {
    if (!this.currentSession.canWrite) {
      this.router.transitionTo('meetings.edit');
    }
  }
}
