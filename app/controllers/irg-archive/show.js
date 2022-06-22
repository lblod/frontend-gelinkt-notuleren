import Controller from '@ember/controller';
import { action } from '@ember/object';
import generateExportFromHtmlBody from '../../utils/generate-export-from-html-body';

export default class IrgArchiveShowController extends Controller {
  @action
  download() {
    generateExportFromHtmlBody(
      this.model.editorDocument.title,
      this.model.editorDocument.content
    );
  }
}
