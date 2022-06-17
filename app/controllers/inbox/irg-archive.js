import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class InboxIrgArchiveController extends Controller {
  @tracked page = 0;
  @tracked size = 10;
  @tracked filter = '';
}
