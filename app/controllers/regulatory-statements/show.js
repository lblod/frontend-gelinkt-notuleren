import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import generateExportFromEditorDocument from 'frontend-gelinkt-notuleren/utils/generate-export-from-editor-document';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';
import { replaceUris } from '../../utils/replace-uris';

export default class RegulatoryAttachmentsShowController extends Controller {
  @service currentSession;
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

    const newDocument = this.store.createRecord('editor-document', {
      createdOn: new Date(),
      updatedOn: new Date(),
      content: content,
      title: currentVersion.title,
      previousVersion: currentVersion,
      documentContainer,
    });
    yield newDocument.save();
    currentVersion.nextVersion = newDocument;
    yield currentVersion.save();
    documentContainer.currentVersion = newDocument;
    yield documentContainer.save();
    this.router.transitionTo(
      'regulatory-statements.edit',
      documentContainer.id
    );
  }

  get readOnly() {
    return !this.currentSession.canWrite && this.currentSession.canRead;
  }
}
