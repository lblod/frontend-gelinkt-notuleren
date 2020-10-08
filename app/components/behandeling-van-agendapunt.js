import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';
import { action } from "@ember/object";
import { inject as service } from '@ember/service';

export default class BehandelingVanAgendapuntComponent extends Component {
  @tracked openbaar;
  @tracked document
  @tracked documentContainer;
  @service store;
  @service currentSession;
  @tracked behandeling;
  editor;

  constructor() {
    super(...arguments);
    this.openbaar = this.args.behandeling.openbaar;
    this.behandeling = this.args.behandeling;
    this.documentContainer = this.args.behandeling.documentContainer;
    this.tryToFetchDocument.perform();
  }
  @task
  *tryToFetchDocument() {
    yield this.args.behandeling.documentContainer;
    if(this.documentContainer.content) {
      this.document = yield this.documentContainer.get('currentVersion');
      if(!this.document) {
        this.document = this.store.createRecord('editor-document');
      }
    } else {
      this.document = this.store.createRecord('editor-document');
      this.documentContainer = this.store.createRecord('document-container');
      this.documentContainer.currentVersion = this.document;
      this.behandeling.documentContainer = this.documentContainer;
      yield this.document.save();
      yield this.documentContainer.save();
      yield this.behandeling.save();
    }
  }
  @action
  async save(e) {
    e.stopPropagation();
    this.behandeling.openbaar = this.openbaar;
    await this.saveEditorDocument.perform(this.document);
    await this.behandeling.save();
  }

  @action
  handleRdfaEditorInit(editor){
    if(this.document.content) {
      editor.setHtmlContent(this.document.content.content);
    }
    this.editor = editor;
  }

  @action
  toggleOpenbaar(e) {
    this.openbaar = e.target.checked;
  }

  @task
  *saveEditorDocument(editorDocument, newStatus, newFolder) {
    yield this.saveTasklists();
    // create or extract properties
    let cleanedHtml = this.editor.htmlContent;
    let createdOn = editorDocument.get('createdOn') || new Date();
    let updatedOn = new Date();
    let title = editorDocument.get('title');
    if(!this.documentContainer) {
      this.documentContainer = (yield this.store.createRecord('document-container').save());
    }
    let documentContainer = yield this.documentContainer;
    let status = newStatus ? newStatus : (yield documentContainer.get('status'));
    let folder = newFolder ? newFolder : (yield documentContainer.get('folder'));

    // every save results in new document
    let documentToSave = this.store.createRecord('editor-document', {content: cleanedHtml, createdOn, updatedOn, title, documentContainer});

    // Link the previous if provided editorDocument does exist in DB.
    if(editorDocument.get('id'))
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
