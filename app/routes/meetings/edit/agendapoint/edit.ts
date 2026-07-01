import Route from '@ember/routing/route';
import { service } from '@ember/service';
import RSVP from 'rsvp';
import type StandardTemplateService from 'frontend-gelinkt-notuleren/services/standard-template';
import type { ModelFrom } from 'frontend-gelinkt-notuleren/utils/types';
import type MeetingsEditAgendapointRoute from '../agendapoint';

export default class MeetingsEditAgendapointEditRoute extends Route {
  @service declare standardTemplate: StandardTemplateService;

  async model() {
    console.log('agendapoint edit route hook running');

    // deliberately not using the editorDocument from the parent route, since
    // this.modelFor does not rerun the parent's route hook if it's already loaded.
    // So if we transition here from a sibling route, such as the .new route,
    // we might have an out-of-date currentVersion on the container
    const { returnToMeeting, documentContainer } = this.modelFor(
      'meetings.edit.agendapoint',
    ) as ModelFrom<MeetingsEditAgendapointRoute>;
    const templates = this.standardTemplate.fetchTemplates.perform();

    return RSVP.hash({
      returnToMeeting,
      documentContainer,
      // asking ember-data to fetch the currentVersion again
      editorDocument: documentContainer.currentVersion,
      // This does not include dynamic templates as it is only used for the standard template plugin
      templates,
    });
  }
}
