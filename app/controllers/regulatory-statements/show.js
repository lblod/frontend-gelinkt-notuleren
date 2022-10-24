import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import generateExportFromEditorDocument from 'frontend-gelinkt-notuleren/utils/generate-export-from-editor-document';
import { action } from '@ember/object';

export default class RegulatoryAttachmentsShowController extends Controller {
  @service currentSession;
  @service router;

  @action
  download() {
    generateExportFromEditorDocument(this.model.editorDocument);
  }

  get readOnly() {
    return !this.currentSession.canWrite && this.currentSession.canRead;
  }
}
