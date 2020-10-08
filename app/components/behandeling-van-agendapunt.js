import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';
import { action } from "@ember/object";
import { inject as service } from '@ember/service';

export default class BehandelingVanAgendapuntComponent extends Component {
  @tracked openbaar;
  @tracked document
  @service store;
  @service currentSession;
  @tracked behandeling;
  editor;

  constructor() {
    super(...arguments);
    this.openbaar = this.args.behandeling.openbaar;
    this.behandeling = this.args.behandeling;
    this.document = this.args.behandeling.document;
    this.tryToFetchDocument.perform();
  }
  @task
  *tryToFetchDocument() {
    yield this.document;
    if(!this.document.content) {
      this.document = this.store.createRecord('editor-document');
    }
  }
  @action
  async save(e) {
    e.stopPropagation();
    this.behandeling.openbaar = this.openbaar;
    const newDocument = await this.saveEditorDocument.perform(this.document);
    this.behandeling.document = newDocument;
    this.document = newDocument;
    await this.behandeling.save();
  }

  @action
  handleRdfaEditorInit(editor){
    editor.setHtmlContent(this.document.content.content);
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
    let documentContainer = this.documentContainer || (yield this.store.createRecord('document-container').save());
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
