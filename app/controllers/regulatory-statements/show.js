import Controller from '@ember/controller';
import { service } from '@ember/service';
import generateExportFromEditorDocument from 'frontend-gelinkt-notuleren/utils/generate-export-from-editor-document';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';
import { replaceUris } from '../../utils/replace-uris';
import { tracked } from '@glimmer/tracking';

export default class RegulatoryAttachmentsShowController extends Controller {
  @service currentSession;
  @service documentService;
  @service router;
  @service intl;
  @tracked revisions;

  @action
  download() {
    generateExportFromEditorDocument(this.model.editorDocument);
  }

  fetchRevisions = task(async () => {
    const revisionsToSkip = [this.model.editorDocument.id];
    this.revisions = await this.documentService.fetchRevisions.perform(
      this.model.documentContainer.id,
      revisionsToSkip,
      5
    );
  });

  createNewVersion = task(async () => {
    if (!this.currentSession.canWrite) return;
    const currentVersion = this.model.editorDocument;
    const documentContainer = this.model.documentContainer;
    //If it's published
    let content = replaceUris(currentVersion.content);
    await this.documentService.createEditorDocument.perform(
      currentVersion.title,
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
