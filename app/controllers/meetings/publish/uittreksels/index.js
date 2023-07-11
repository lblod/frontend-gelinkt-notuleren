import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class MeetingsPublishUittrekselsController extends Controller {
  queryParams = ['page', 'pageSize', 'sort', 'title'];
  @tracked debounceTime = 2000;
  @tracked page = 0;
  @tracked pageSize = 20;
  @tracked sort = 'position';
  @tracked title = '';
}
