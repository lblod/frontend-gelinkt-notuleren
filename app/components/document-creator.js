import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { task, waitForProperty } from "ember-concurrency";
import { DRAFT_FOLDER_ID, DRAFT_STATUS_ID } from 'frontend-gelinkt-notuleren/utils/constants';
import instantiateUuids from '@lblod/ember-rdfa-editor-standard-template-plugin/utils/instantiate-uuids';

export default class DocumentCreatorComponent extends Component {
  @tracked title = "";
  @tracked type;
  @tracked template
  @tracked templateOptions = [];
  @tracked invalidTitle;
  @tracked errorSaving;

  @service store;
  @service rdfaEditorStandardTemplatePlugin;
  @service currentSession;

  constructor() {
    super(...arguments);
    this.ensureTemplates.perform();
  }

  @action
  rollback() {
    this.title = "";
    this.invalidTitle = false;
    this.template = null;
    if (this.args.onRollback) {
      this.args.onRollback();
    }
  }

  @action
  updateTitle(event) {
    this.title = event.target.value;
    this.validateTitle();
  }

  @action
  onSelectTemplate(template) {
    this.template = template;
  }

  get isSaving() {
    return this.persistDocument.isRunning;
  }

  validateTitle() {
    if (this.title?.length > 0) {
      this.invalidTitle = false;
    }
    else {
      this.invalidTitle = true;
    }
  }

  validateForm() {
    this.validateTitle();
    return ! this.invalidTitle;
  }

  @action
  async create() {
    if (this.validateForm()) {
      const container = await this.persistDocument.perform();
      if (this.args.onCreate) {
        this.args.onCreate(container);
      }
    }
  }

  @task
  *ensureTemplates() {
    yield waitForProperty(this.rdfaEditorStandardTemplatePlugin, 'templates');
    const templates = this.rdfaEditorStandardTemplatePlugin.templates;
    this.templateOptions = this.rdfaEditorStandardTemplatePlugin.templatesForContext(templates, ['http://data.vlaanderen.be/ns/besluit#BehandelingVanAgendapunt']);
  }

  async buildTemplate() {
    if (this.template) {
      await this.template.reload(); // templatesForContext does not return body of template
      return instantiateUuids(this.template.body);
    }
    else
      return "";
  }

  @task
  *persistDocument() {
    try {
      this.errorSaving=null;
      const creationDate = new Date();
      const generatedTemplate = yield this.buildTemplate();
      const editorDocument = this.store.createRecord('editor-document', {
        createdOn: creationDate,
        updatedOn: creationDate,
        content: generatedTemplate,
        title: this.title
      });
      yield editorDocument.save();
      const container = this.store.createRecord('document-container');
      container.status = yield this.store.findRecord('concept', DRAFT_STATUS_ID);
      container.folder = yield this.store.findRecord('editor-document-folder', DRAFT_FOLDER_ID);
      container.publisher = this.currentSession.group;
      container.currentVersion = editorDocument;
      yield container.save();
      return container;
    }
    catch(e) {
      this.errorSaving = e.message;
    }
  }
}
