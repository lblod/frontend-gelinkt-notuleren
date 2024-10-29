import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { PUBLISHED_STATUS_ID } from '../../../utils/constants';

export default class MeetingsEditManualVotingRoute extends Route {
  @service currentSession;
  @service router;
  @service store;

  async model(params) {
    const voting = await this.store.findRecord(
      'custom-voting',
      params.voting_id,
      {
        include: 'voting-document',
      },
    );
    // Include returns a random document, fixed it by awaiting the current version in the next line, TODO: look for a cause and fix this in the source
    await voting.votingDocument.get('currentVersion');
    const behandeling = await voting.behandelingVanAgendapunt;
    const documentContainer = await behandeling.documentContainer;
    const status = await documentContainer.status;
    const statusId = status.id;
    let published = false;
    if (statusId === PUBLISHED_STATUS_ID) {
      published = true;
    }
    return { voting, published };
  }

  beforeModel() {
    if (!this.currentSession.canWrite) {
      this.router.transitionTo('meetings.edit');
    }
  }
}
