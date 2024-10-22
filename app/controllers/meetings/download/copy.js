import Controller from '@ember/controller';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { generateExportTextFromEditorDocument } from '../../../utils/generate-export-from-editor-document';
import { copyStringToClipboard } from '../../../utils/copy-string-to-clipboard';

export default class MeetingsDownloadCopyController extends Controller {
  @action
  async copyToClipboard(text) {
    await copyStringToClipboard({ html: text });
  }

  get previewDocument() {
    return htmlSafe(
      generateExportTextFromEditorDocument(this.model.document, true),
    );
  }
}
