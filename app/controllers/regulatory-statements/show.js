import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import generateExportFromEditorDocument from 'frontend-gelinkt-notuleren/utils/generate-export-from-editor-document';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';
import { replaceUris } from '../../utils/replace-uris';

export default class RegulatoryAttachmentsShowController extends Controller {
  @service currentSession;
  @service documentService;
  @service router;

  @action
  download() {
    generateExportFromEditorDocument(this.model.editorDocument);
  }

  @task
  *createNewVersion() {
    if (!this.currentSession.canWrite) return;
    const currentVersion = this.model.editorDocument;
    const documentContainer = this.model.documentContainer;
    //If it's published
    let content = replaceUris(currentVersion.content);
    yield this.documentService.createEditorDocument.perform(
      currentVersion.title,
      content,
      documentContainer,
      currentVersion
    );
    this.router.transitionTo(
      'regulatory-statements.edit',
      documentContainer.id
    );
  }

  get readOnly() {
    return !this.currentSession.canWrite && this.currentSession.canRead;
  }
}
