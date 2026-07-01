import Controller from '@ember/controller';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class MeetingsEditController extends Controller {
  @service declare router: RouterService;

  queryParams = ['focused'];
  @tracked
  focused = false;

  hiddenRoutes = [
    'meetings.edit.agendapoint',
    'meetings.edit.agendapoint.attachments',
    'meetings.edit.agendapoint.copy',
    'meetings.edit.agendapoint.edit',
    // the create new modal looks odd without a background
    // leaving it commented out to show it's intentionally omitted here
    // 'meetings.edit.agendapoint.new',
    'meetings.edit.agendapoint.revisions',
  ];

  get hideMeetingForm() {
    const { currentRouteName } = this.router;
    return currentRouteName && this.hiddenRoutes.includes(currentRouteName);
  }
}
