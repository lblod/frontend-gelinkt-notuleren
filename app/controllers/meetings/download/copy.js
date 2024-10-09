import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class MeetingsDownloadCopyController extends Controller {
  @action
  async copyToClipboard(text) {
    // TODO error handling, e.g. not secure...
    await navigator.clipboard.writeText(text.trim());
  }
}
