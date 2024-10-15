import Controller from '@ember/controller';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { generateExportTextFromEditorDocument } from '../../../utils/generate-export-from-editor-document';

export default class MeetingsDownloadCopyController extends Controller {
  @action
  async copyToClipboard(text) {
    // TODO error handling, e.g. not secure...
    await navigator.clipboard.writeText(text.trim());
  }

  get previewDocument() {
    return htmlSafe(
      generateExportTextFromEditorDocument(this.model.document, true),
    );
  }
}
