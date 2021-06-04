import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';

export default class AgendapointsRevisionsController extends Controller {
  @tracked showConfirmationModal = false;
  @tracked revisionToRemove;
  @tracked revisionsToRemove;
  @tracked revisionDetail;

  get orderedRevisions() {
    return this.model.revisions;
  }

  @task
  *setNewRevisionHistory(revisionsToRemove, revision) {
    this.model.container.set('currentVersion', revision);
    yield this.model.container.save();
    this.model.editorDocument = revision;
    yield Promise.all(revisionsToRemove.map( r => r.destroyRecord()));
    this.orderedRevisions.removeObjects(revisionsToRemove);
    this.flushThingsToRemove();
  }

  getRevisionsToRemove(revision){
    let revisionsToRemove = [];

    for(let r of this.orderedRevisions){
      if(r.id === revision.id) break;
      revisionsToRemove.pushObject(r);
    }

    return revisionsToRemove;
  }

  flushThingsToRemove(){
    this.showConfirmationModal = false;
    this.revisionToRemove = null;
    this.revisionsToRemove = null;
    this.revisionDetail = null;
  }

  @action
  cancelConfirmRevisionsToRemove(){
    this.flushThingsToRemove();
  }

  @action
  confirmRevisionsToRemove(revision){
    this.showConfirmationModal = true;
    this.revisionsToRemove = this.getRevisionsToRemove(revision);
    this.revisionToRemove = revision;
  }

  @action
  restore(){
    this.setNewRevisionHistory.perform(this.revisionsToRemove, this.revisionToRemove);
  }

  @action
  details(revision){
    this.revisionDetail = revision;
  }

  @action
  cancelDetails(){
    this.revisionDetail = null;
  }
}
