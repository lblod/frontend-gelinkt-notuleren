import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';
import generateExportFromEditorDocument from 'frontend-gelinkt-notuleren/utils/generate-export-from-editor-document';
import { service } from '@ember/service';
export default class AgendapointsRevisionsController extends Controller {
  @service router;
  @service intl;
  @tracked showConfirmationModal = false;
  @tracked revisionToRemove;
  @tracked revisionsToRemove;
  @tracked revisionDetail;

  get documentContainer() {
    return this.model.documentContainer;
  }

  get editorDocument() {
    return this.model.editorDocument;
  }

  get orderedRevisions() {
    return this.model.revisions;
  }

  setNewRevisionHistory = task(async (revisionsToRemove, revision) => {
    this.documentContainer.set('currentVersion', revision);
    await this.documentContainer.save();
    this.model.editorDocument = revision;
    await Promise.all(revisionsToRemove.map((r) => r.destroyRecord()));
    this.orderedRevisions.removeObjects(revisionsToRemove);
    this.flushThingsToRemove();
    this.router.transitionTo('agendapoints.edit', this.documentContainer.id);
  });

  @action
  download() {
    generateExportFromEditorDocument(this.revisionDetail);
  }

  getRevisionsToRemove(revision) {
    let revisionsToRemove = [];

    for (let r of this.orderedRevisions) {
      if (r.id === revision.id) break;
      revisionsToRemove.pushObject(r);
    }

    return revisionsToRemove;
  }

  flushThingsToRemove() {
    this.showConfirmationModal = false;
    this.revisionToRemove = null;
    this.revisionsToRemove = null;
  }

  @action
  cancelConfirmRevisionsToRemove() {
    this.flushThingsToRemove();
  }

  @action
  confirmRevisionsToRemove(revision) {
    this.showConfirmationModal = true;
    this.revisionsToRemove = this.getRevisionsToRemove(revision);
    this.revisionToRemove = revision;
  }

  @action
  restore() {
    this.setNewRevisionHistory.perform(
      this.revisionsToRemove,
      this.revisionToRemove
    );
  }

  @action
  details(revision) {
    this.revisionDetail = revision;
  }

  @action
  cancelDetails() {
    this.revisionDetail = null;
  }
}
