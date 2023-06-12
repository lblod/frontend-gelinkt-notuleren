import Controller from '@ember/controller';
import { service } from '@ember/service';
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
  @service intl;
  @service documentService;
  @tracked revisions;

  fetchRevisions = task(async () => {
    const revisionsToSkip = [this.model.currentVersion.id];
    this.revisions = await this.documentService.fetchRevisions.perform(
      this.model.documentContainer.id,
      revisionsToSkip,
      5
    );
  });

  @action
  download() {
    generateExportFromEditorDocument(this.model.editorDocument);
  }

  restoreTask = task(async () => {
    const currentVersion = this.model.currentVersion;
    const toRestore = this.model.editorDocument;
    const documentContainer = this.model.documentContainer;
    let content = replaceUris(toRestore.content);
    await this.documentService.createEditorDocument.perform(
      toRestore.title,
      content,
      documentContainer,
      currentVersion
    );
    this.router.transitionTo(
      'regulatory-statements.edit',
      documentContainer.id
    );
  });

  get readOnly() {
    return !this.currentSession.canWrite && this.currentSession.canRead;
  }
}
