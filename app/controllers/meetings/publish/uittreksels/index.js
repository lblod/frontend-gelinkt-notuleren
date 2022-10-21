import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class MeetingsPublishUittrekselsController extends Controller {
  sort = 'position';
  @tracked debounceTime = 2000;
  @tracked page = 0;
  @tracked pageSize = 20;
}
