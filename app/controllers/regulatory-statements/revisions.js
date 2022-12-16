import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import generateExportFromEditorDocument from 'frontend-gelinkt-notuleren/utils/generate-export-from-editor-document';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { replaceUris } from '../../utils/replace-uris';

export default class RegulatoryAttachmentsShowController extends Controller {
  @service currentSession;
  @service documentService;
  @service router;
  @service store;
  @service documentService;
  @tracked revisions;

  @task
  *fetchRevisions() {
    const revisionsToSkip = [
      this.model.currentVersion.id,
      this.model.editorDocument.id,
    ];
    this.revisions = yield this.documentService.fetchRevisions.perform(
      this.model.documentContainer.id,
      revisionsToSkip,
      5
    );
  }

  @action
  download() {
    generateExportFromEditorDocument(this.model.editorDocument);
  }

  @task
  *restoreTask() {
    const currentVersion = this.model.currentVersion;
    const toRestore = this.model.editorDocument;
    const documentContainer = this.model.documentContainer;
    let content = replaceUris(toRestore.content);
    yield this.documentService.createEditorDocument.perform(
      toRestore.title,
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
