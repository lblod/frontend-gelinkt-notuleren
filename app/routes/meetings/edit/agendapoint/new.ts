import Route from '@ember/routing/route';
import { service } from '@ember/service';
import RSVP from 'rsvp';
import type { ModelFrom } from 'frontend-gelinkt-notuleren/utils/types';
import type MeetingsEditAgendapointRoute from '../agendapoint';
import type Store from 'frontend-gelinkt-notuleren/services/gn-store';
import type ConceptModel from 'frontend-gelinkt-notuleren/models/concept';
import { SCHEDULED_STATUS_ID } from 'frontend-gelinkt-notuleren/utils/constants';

export default class MeetingsEditAgendapointNewRoute extends Route {
  @service declare store: Store;

  async model() {
    const parentModel = this.modelFor(
      'meetings.edit.agendapoint',
    ) as ModelFrom<MeetingsEditAgendapointRoute>;

    const scheduledStatus = this.store.findRecord<ConceptModel>(
      'concept',
      SCHEDULED_STATUS_ID,
    );

    return RSVP.hash({
      ...parentModel,
      scheduledStatus,
    });
  }
}
