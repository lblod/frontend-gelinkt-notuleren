import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import generateExportFromEditorDocument from 'frontend-gelinkt-notuleren/utils/generate-export-from-editor-document';
import { action } from '@ember/object';

export default class AgendapointsShowController extends Controller {
  @service currentSession;

  @action
  download() {
    generateExportFromEditorDocument(this.model.editorDocument);
  }

}
