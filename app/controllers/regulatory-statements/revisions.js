import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import generateExportFromEditorDocument from 'frontend-gelinkt-notuleren/utils/generate-export-from-editor-document';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

export default class RegulatoryAttachmentsShowController extends Controller {
  @service currentSession;
  @service router;
  @service store;
  @tracked revisions;

  @task
  *fetchRevisions() {
    const revisions = yield this.store.query('editor-document', {
      'filter[document-container][id]': this.model.documentContainer.id,
      sort: '-updated-on',
      'page[size]': 5,
    });
    const revisionsWithoutCurrentVersion = revisions.filter(
      (revision) =>
        revision.id !== this.model.currentVersion.id &&
        revision.id !== this.model.editorDocument.id
    );
    this.revisions = revisionsWithoutCurrentVersion;
  }

  @action
  download() {
    generateExportFromEditorDocument(this.model.editorDocument);
  }

  @task
  restoreTask() {
    this.model.documentContainer;
  }

  get readOnly() {
    return !this.currentSession.canWrite && this.currentSession.canRead;
  }
}
