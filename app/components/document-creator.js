import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';
import { DRAFT_STATUS_ID } from 'frontend-gelinkt-notuleren/utils/constants';
import { instantiateUuids } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/standard-template-plugin';
import templateUuidInstantiator from '@lblod/template-uuid-instantiator';

export default class DocumentCreatorComponent extends Component {
  @tracked title = '';
  @tracked type;
  @tracked template;
  @tracked invalidTitle;
  @tracked invalidTemplate;
  @tracked errorSaving;

  @service store;
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
      /**
       * Document Creator component is used by two different screens:
       *   - Create agenda point flow
       *   - Create regulatory statements flow
       *
       * `templates` coming from regulatory statements flow are _NOT_ `TemplateModel` instances,
       * they are just plain objects with a `title` and a `loadTemplateBody` property. So we
       * have to use `loadTemplateBody` to load the template body if we need to build the template
       * when creating a regulatory statement.
       *
       * This was previously checking and calling `this.template.reload`, but that was causing
       * `reload` to mutate from function to a "boolean" when `TemplateModel` of `ember-data` is used,
       * causing errors when calling `reload` on the template again, as it became a boolean.
       *
       * The fix was to change `reload` to `loadTemplateBody` in `RegulatoryAttachmentsFetcher`
       */
      if (this.template.loadBody) {
        await this.template.loadBody();
        const trimmedHtml = this.template.body.replace(/>\s+</g, '><');
        //If the template comes from RB we instantiate it with the new library
        return templateUuidInstantiator(trimmedHtml);
      } else {
        const trimmedHtml = this.template.body.replace(/>\s+</g, '><');
        // If it's a built=in template, we apply both instantiate functions
        return instantiateUuids(templateUuidInstantiator(trimmedHtml));
      }
    } else return '';
  }

  persistDocument = task(async () => {
    try {
      this.errorSaving = null;
      const generatedTemplate = await this.buildTemplate();
      const container = this.store.createRecord('document-container');
      container.status = await this.store.findRecord(
        'concept',
        DRAFT_STATUS_ID,
      );
      container.folder = await this.store.findRecord(
        'editor-document-folder',
        this.args.folderId,
      );
      container.publisher = this.currentSession.group;
      const editorDocument =
        await this.documentService.createEditorDocument.perform(
          this.title,
          generatedTemplate,
          container,
        );
      container.currentVersion = editorDocument;
      await container.save();
      return container;
    } catch (e) {
      this.errorSaving = e.message;
    }
  });
}
