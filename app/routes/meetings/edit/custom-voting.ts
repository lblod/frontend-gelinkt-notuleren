import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import type StoreService from 'frontend-gelinkt-notuleren/services/gn-store';
import type CurrentSessionService from 'frontend-gelinkt-notuleren/services/current-session';
import { PUBLISHED_STATUS_ID } from '../../../utils/constants';
import CustomVotingModel from 'frontend-gelinkt-notuleren/models/custom-voting';

export default class MeetingsEditCustomVotingRoute extends Route {
  @service declare currentSession: CurrentSessionService;
  @service declare router: RouterService;
  @service declare store: StoreService;

  async model(params: { voting_id: string }) {
    const voting = await this.store.findRecord<CustomVotingModel>(
      'custom-voting',
      params.voting_id,
      {
        include: ['votingDocument.currentVersion'],
      },
    );
    const behandeling = await voting.behandelingVanAgendapunt;
    const documentContainer = await behandeling?.documentContainer;
    const status = await documentContainer?.status;
    const statusId = status?.id;
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
