import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { A } from '@ember/array';

export default Controller.extend({

  showConfirmationModal: false,
  revisionToRemove: null,
  revisionsToRemove: null,

  fetchRevisions: task(function * () {
    let currDocument = this.model.editorDocument;
    let revisions = A([ currDocument ]);
    let revision = yield currDocument.get('previousVersion');
    while(revision){
      revisions.pushObject(revision);
      revision = yield revision.get('previousVersion');
    }
    this.set('orderedRevisions', revisions);
  }),

  setNewRevisionHistory: task(function * (revisionsToRemove, revision) {
    this.model.documentContainer.set('currentVersion', revision);
    yield this.model.documentContainer.save();
    this.set('model.editorDocument', revision);
    yield Promise.all(revisionsToRemove.map( r => r.destroyRecord()));;
    this.orderedRevisions.removeObjects(revisionsToRemove);
    this.flushThingsToRemove();
  }),

  getRevisionsToRemove(revision){
    let revisionsToRemove = A();

    for(let r of this.orderedRevisions){
      if(r.id === revision.id) break;
      revisionsToRemove.pushObject(r);
    }

    return revisionsToRemove;
  },

  flushThingsToRemove(){
    this.set('showConfirmationModal', false);
    this.set('revisionToRemove', null);
    this.set('revisionsToRemove', null);
  },

  actions: {

    cancelConfirmRevisionsToRemove(){
      this.flushThingsToRemove();
    },

    confirmRevisionsToRemove(revision){
      this.set('showConfirmationModal', true);
      this.set('revisionsToRemove', this.getRevisionsToRemove(revision));
      this.set('revisionToRemove', revision);
    },

    restore(){
      this.setNewRevisionHistory.perform(this.revisionsToRemove, this.revisionToRemove);
    },

    details(revision){
      this.transitionToRoute('editor-documents.revisions.details', revision.id);
    },

    back(revision){
      this.transitionToRoute('editor-documents.edit', this.model.documentContainer.id);
    }
  }
});
