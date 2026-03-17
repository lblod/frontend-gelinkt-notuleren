import Controller from '@ember/controller';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class MeetingsEditController extends Controller {
  @service declare router: RouterService;

  queryParams = ['focused'];
  @tracked
  focused = false;

  get hideMeetingForm() {
    return this.router.currentRouteName?.startsWith(
      'meetings.edit.agendapoint',
    );
  }
}
