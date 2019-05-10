import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { A } from '@ember/array';

export default Controller.extend({

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

  cleanUpFutureVersions: task(function * (revision) {
    this.model.documentContainer.set('currentVersion', revision);
    yield this.model.documentContainer.save();
    this.set('model.editorDocument', revision);

    let revisionsToRemove = A();

    for(let r of this.orderedRevisions){
      if(r.id === revision.id) break;
      revisionsToRemove.pushObject(r);
    }

    yield Promise.all(revisionsToRemove.map( r => r.destroyRecord()));;
    this.orderedRevisions.removeObjects(revisionsToRemove);
  }),

  actions: {
    restore(revision){
      this.cleanUpFutureVersions.perform(revision);
    },

    details(revision){
      this.transitionToRoute('editor-documents.revisions.details', revision.id);
    },

    back(revision){
      this.transitionToRoute('editor-documents.edit', this.model.documentContainer.id);
    }
  }
});
