import Route from '@ember/routing/route';
import { service } from '@ember/service';
import RSVP from 'rsvp';
import type StandardTemplateService from 'frontend-gelinkt-notuleren/services/standard-template';
import type { ModelFrom } from 'frontend-gelinkt-notuleren/utils/types';
import type MeetingsEditAgendapointRoute from '../agendapoint';

export default class MeetingsEditAgendapointEditRoute extends Route {
  @service declare standardTemplate: StandardTemplateService;

  async model() {
    const parentModel = this.modelFor(
      'meetings.edit.agendapoint',
    ) as ModelFrom<MeetingsEditAgendapointRoute>;
    const templates = this.standardTemplate.fetchTemplates.perform();

    return RSVP.hash({
      ...parentModel,
      // This does not include dynamic templates as it is only used for the standard template plugin
      templates,
    });
  }
}
