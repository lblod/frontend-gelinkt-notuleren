import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class MeetingsEditController extends Controller {
  queryParams = ['focused'];
  @tracked
  focused = false;
}
