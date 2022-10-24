import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { DRAFT_STATUS_ID } from 'frontend-gelinkt-notuleren/utils/constants';
import { v4 as uuidv4 } from 'uuid';

export default class DocumentCreatorComponent extends Component {
  @tracked title = '';
  @tracked type;
  @tracked template;
  @tracked invalidTitle;
  @tracked invalidTemplate;
  @tracked errorSaving;

  @service store;
  @service rdfaEditorStandardTemplatePlugin;
  @service currentSession;
  @service documentService;

  @action
  rollback() {
    this.title = '';
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
    this.validateTemplate();
  }

  get isSaving() {
    return this.persistDocument.isRunning;
  }

  validateTitle() {
    //Length still needs to be > 0 with whitespaces removed
    if (this.title?.trim().length > 0) {
      this.invalidTitle = false;
    } else {
      this.invalidTitle = true;
    }
  }

  validateTemplate() {
    if (this.template) {
      this.invalidTemplate = false;
    } else {
      this.invalidTemplate = true;
    }
  }

  validateForm() {
    this.validateTitle();
    this.validateTemplate();
    return !this.invalidTemplate && !this.invalidTitle;
  }

  @action
  async create() {
    if (this.validateForm()) {
      const container = await this.persistDocument.perform();
      if (this.args.onCreate) {
        this.args.onCreate(container, this.template);
      }
    }
  }

  async buildTemplate() {
    if (this.template) {
      if (this.template.reload) {
        // regular templates from templatesForContext do not return body of template
        await this.template.reload(this.template);
      }
      return instantiateUuids(this.template.body);
    } else return '';
  }

  @task
  *persistDocument() {
    try {
      this.errorSaving = null;
      const generatedTemplate = yield this.buildTemplate();
      const container = this.store.createRecord('document-container');
      container.status = yield this.store.findRecord(
        'concept',
        DRAFT_STATUS_ID
      );
      container.folder = yield this.store.findRecord(
        'editor-document-folder',
        this.args.folderId
      );
      container.publisher = this.currentSession.group;
      const editorDocument = yield this.documentService.createEditorDocument.perform(this.title,  generatedTemplate, container);
      container.currentVersion = editorDocument;
      yield container.save();
      return container;
    } catch (e) {
      this.errorSaving = e.message;
    }
  }
}
// we can't afford to import the one from the template plugin
// as the regex is way too loose and also tries to evaluate
// all the variables in the string, which coincidentally use the
// exact same syntax
function instantiateUuids(templateString) {
  let generateUuid = uuidv4; // eslint-disable-line no-unused-vars
  return templateString.replace(/\$\{generateUuid\(\)\}/g, (match) => {
    //input '${content}' and eval('content')
    return eval(match.substring(2, match.length - 1));
  });
}
