import Controller from '@ember/controller';
import { action } from '@ember/object';

import { copyStringToClipboard } from 'frontend-gelinkt-notuleren/utils/copy-string-to-clipboard';

export default class RegulatoryAttachmentsCopyController extends Controller {
  @action
  async copyToClipboard(text) {
    await copyStringToClipboard({ html: text });
  }
}
