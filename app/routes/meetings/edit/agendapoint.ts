import Route from '@ember/routing/route';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import RSVP from 'rsvp';
import type CurrentSessionService from 'frontend-gelinkt-notuleren/services/current-session';
import type { ModelFrom } from 'frontend-gelinkt-notuleren/utils/types';
import type StoreService from 'frontend-gelinkt-notuleren/services/gn-store';
import type DocumentContainerModel from 'frontend-gelinkt-notuleren/models/document-container';
import type MeetingsEditRoute from '../edit';

export default class MeetingsEditAgendapointRoute extends Route {
  @service declare currentSession: CurrentSessionService;
  @service declare router: RouterService;
  @service declare store: StoreService;

  beforeModel() {
    if (!this.currentSession.canWrite) {
      this.router.transitionTo('meetings.edit');
      return;
    }
  }

  async model(params: { agendapoint_id: string }) {
    const meeting = this.modelFor(
      'meetings.edit',
    ) as ModelFrom<MeetingsEditRoute>;
    const documentContainer =
      await this.store.findRecord<DocumentContainerModel>(
        'document-container',
        params.agendapoint_id,
        { include: ['status'] },
      );

    return RSVP.hash({
      documentContainer,
      editorDocument: documentContainer.currentVersion,
      returnToMeeting: meeting,
    });
  }
}
