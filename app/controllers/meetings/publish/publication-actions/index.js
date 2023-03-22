import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class MeetingsPublishPublicationActionsController extends Controller {
  sort = '-date';
  @tracked page = 0;
  @tracked pageSize = 20;
}
