import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';
import { action } from "@ember/object";
import { inject as service } from '@ember/service';

export default class BehandelingVanAgendapuntComponent extends Component {
  @tracked openbaar;
  @service store;
  @service currentSession;
  editor;

  constructor() {
    super(...arguments);
    this.openbaar = this.args.agendapunt.behandeling.openbaar;
    console.log(this.args.agendapunt);
    if(!this.args.agendapunt.behandeling.documentContainer) {
      this.args.agendapunt.behandeling.documentContainer = this.store.createRecord('editor-document');
      
    }
  }
  @action
  save(e) {
    e.stopPropagation();
    this.args.agendapunt.behandeling.openbaar = this.openbaar;
    this.saveEditorDocument.perform(this.args.agendapunt.behandeling.documentContainer);
    this.args.agendapunt.behandeling.save();
  }

  @action
  handleRdfaEditorInit(editor){
    this.editor = editor;
  }

  @task
  *saveEditorDocument(editorDocument, newStatus, newFolder) {
    yield this.saveTasklists();
    console.log(editorDocument);
    // create or extract properties
    let cleanedHtml = this.editor.htmlContent;
    let createdOn = editorDocument.get('createdOn') || new Date();
    let updatedOn = new Date();
    let title = editorDocument.get('title');
    let documentContainer = this.documentContainer || (yield this.store.createRecord('document-container').save());
    console.log(documentContainer)
    let status = newStatus ? newStatus : (yield documentContainer.get('status'));
    let folder = newFolder ? newFolder : (yield documentContainer.get('folder'));

    // every save results in new document
    let documentToSave = this.store.createRecord('editor-document', {content: cleanedHtml, createdOn, updatedOn, title, documentContainer});

    // Link the previous if provided editorDocument does exist in DB.
    if(editorDocument.id)
      documentToSave.set('previousVersion', editorDocument);

    // save the document
    yield documentToSave.save();

    // set the latest revision
    documentContainer.set('currentVersion', documentToSave);
    documentContainer.set('status', status);
    documentContainer.set('folder', folder);
    const bestuurseenheid = yield this.currentSession.get('group');
    documentContainer.set('publisher', bestuurseenheid);
    yield documentContainer.save();

    return documentToSave;
  }
  async saveTasklists(){
    if (!this.tasklists)
      return;
    for(let tasklistSolution of this.tasklists){
      let taskSolutions = await tasklistSolution.taskSolutions.toArray();
      for(let taskSolution of taskSolutions){
        await taskSolution.save();
      }
      await tasklistSolution.save();
    }
  }
}
