import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { undo } from '@lblod/ember-rdfa-editor/plugins/history';

import { TRASH_STATUS_ID } from 'frontend-gelinkt-notuleren/utils/constants';
import StructureControlCardComponent from '@lblod/ember-rdfa-editor-lblod-plugins/components/structure-plugin/control-card';
import InsertArticleComponent from '@lblod/ember-rdfa-editor-lblod-plugins/components/decision-plugin/insert-article';

import { getActiveEditableNode } from '@lblod/ember-rdfa-editor/plugins/_private/editable-node';

import SnippetInsertRdfaComponent from '@lblod/ember-rdfa-editor-lblod-plugins/components/snippet-plugin/snippet-insert-rdfa';
import { fixArticleConnections } from '../../utils/fix-article-connections';
import { modifier } from 'ember-modifier';
import type StoreService from 'frontend-gelinkt-notuleren/services/gn-store';
import type RouterService from '@ember/routing/router-service';
import type DocumentService from 'frontend-gelinkt-notuleren/services/document-service';
import type IntlService from 'ember-intl/services/intl';
import type AgendapointEditorService from 'frontend-gelinkt-notuleren/services/editor/agendapoint';
import type {
  ProsePlugin,
  SayController,
  Schema,
} from '@lblod/ember-rdfa-editor';
import type EditorDocumentModel from 'frontend-gelinkt-notuleren/models/editor-document';
import type AgendapointsEditRoute from 'frontend-gelinkt-notuleren/routes/agendapoints/edit';
import type { ModelFrom } from 'frontend-gelinkt-notuleren/utils/types';
import ConceptModel from 'frontend-gelinkt-notuleren/models/concept';
import BehandelingVanAgendapunt from 'frontend-gelinkt-notuleren/models/behandeling-van-agendapunt';
import { unwrap } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/option';

export default class AgendapointsEditController extends Controller {
  @service declare store: StoreService;
  @service declare router: RouterService;
  @service declare documentService: DocumentService;
  @service declare intl: IntlService;
  @service('editor/agendapoint')
  declare agendapointEditor: AgendapointEditorService;

  declare model: ModelFrom<AgendapointsEditRoute>;

  @tracked hasDocumentValidationErrors = false;
  @tracked displayDeleteModal = false;
  @tracked _editorDocument?: EditorDocumentModel | null;
  @tracked controller?: SayController;
  @tracked showMultipleEditWarning = false;
  cleanedHtml?: string;
  title?: string;

  @tracked schema?: Schema;
  @tracked plugins?: ProsePlugin[];
  @tracked editorSetup = false;

  StructureControlCard = StructureControlCardComponent;
  InsertArticle = InsertArticleComponent;

  SnippetInsert = SnippetInsertRdfaComponent;

  get config() {
    return this.agendapointEditor.config;
  }

  get nodeViews() {
    return this.agendapointEditor.nodeViews;
  }

  get dirty() {
    // Since we clear the undo history when saving, this works. If we want to maintain undo history
    // on save, we would need to add functionality to the editor to track what is the 'saved' state
    return this.controller?.checkCommand(undo, {
      view: this.controller?.mainEditorView,
    });
  }

  get editorDocument() {
    return this._editorDocument || this.model.editorDocument;
  }

  get documentContainer() {
    return this.model.documentContainer;
  }

  get activeNode() {
    if (this.controller) {
      return getActiveEditableNode(this.controller.activeEditorState);
    }
    return null;
  }

  get isBusy() {
    return (
      !this.editorSetup ||
      this.saveTask.isRunning ||
      this.copyAgendapunt.isRunning ||
      this.showMultipleEditWarning ||
      this.confirmMultipleEdit.isRunning
    );
  }

  get busyText() {
    if (!this.editorSetup) {
      return this.intl.t('rdfa-editor-container.loading');
    }
    if (this.saveTask.isRunning) {
      return this.intl.t('rdfa-editor-container.making-copy');
    }
    if (this.copyAgendapunt.isRunning) {
      return this.intl.t('rdfa-editor-container.saving');
    }
    return '';
  }

  setSchemaAndPlugins = modifier(() => {
    const { schema, plugins } =
      this.agendapointEditor.getSchemaAndPlugins(false);
    this.schema = schema;
    this.plugins = plugins;
    this.editorSetup = true;
    return () => {
      this.editorSetup = false;
    };
  });

  @action
  handleRdfaEditorInit(editor: SayController) {
    this.controller = editor;
    editor.initialize(this.editorDocument?.content || '', { doNotClean: true });
  }

  copyAgendapunt = task(async () => {
    const response = await fetch(
      `/agendapoint-service/${this.documentContainer.id}/copy`,
      { method: 'POST' },
    );
    const json = (await response.json()) as Record<string, string>;
    const agendapuntId = json['uuid'];
    await this.router.transitionTo('agendapoints.edit', agendapuntId);
  });

  @action
  toggleDeleteModal() {
    this.displayDeleteModal = !this.displayDeleteModal;
  }

  @action
  closeValidationModal() {
    this.hasDocumentValidationErrors = false;
  }

  @action
  async deleteDocument() {
    const container = this.documentContainer;
    const deletedStatus = await this.store.findRecord<ConceptModel>(
      'concept',
      TRASH_STATUS_ID,
    );
    container.set('status', deletedStatus);
    await container.save();
    this.displayDeleteModal = false;
    this.router.transitionTo('inbox.agendapoints');
  }

  onTitleUpdate = task(async (title: string) => {
    const html = this.editorDocument?.content ?? '';

    await this.documentContainer.currentVersion.reload({});
    const currentVersion = (await this.documentContainer
      .currentVersion) as EditorDocumentModel;
    if (currentVersion.id !== this.editorDocument?.id) {
      this.showMultipleEditWarning = true;
      const html = this.controller?.htmlContent as string;
      const cleanedHtml = this.removeEmptyDivs(html);
      this.cleanedHtml = cleanedHtml;
      this.title = title;
    } else {
      const behandeling = (
        await this.store.query<BehandelingVanAgendapunt>(
          'behandeling-van-agendapunt',
          {
            'filter[document-container][:id:]': this.model.documentContainer.id,
          },
        )
      )[0];
      if (behandeling) {
        const agendaItem = unwrap(await behandeling.onderwerp);
        agendaItem.titel = title;
        await agendaItem.save();
      }

      const editorDocument =
        await this.documentService.createEditorDocument.perform(
          title,
          html,
          this.documentContainer,
          this.editorDocument ?? undefined,
        );

      this._editorDocument = editorDocument;
    }
  });

  saveTask = task(async () => {
    if (!this.controller || !this.editorDocument) {
      return;
    }
    const fixArticleConnectionsTr = fixArticleConnections(
      this.controller.mainEditorState,
    );
    if (fixArticleConnectionsTr) {
      this.controller.mainEditorView.dispatch(fixArticleConnectionsTr);
    }
    if (!this.editorDocument.title) {
      this.hasDocumentValidationErrors = true;
    } else {
      this.hasDocumentValidationErrors = false;
      const html = this.controller.htmlContent;
      const cleanedHtml = this.removeEmptyDivs(html);
      await this.documentContainer.currentVersion.reload({});
      const currentVersion = (await this.documentContainer
        .currentVersion) as EditorDocumentModel;
      if (currentVersion.id !== this.editorDocument.id) {
        this.showMultipleEditWarning = true;
        this.cleanedHtml = cleanedHtml;
        this.title = this.editorDocument.title;
      } else {
        const editorDocument =
          await this.documentService.createEditorDocument.perform(
            this.editorDocument.title,
            cleanedHtml,
            this.documentContainer,
            currentVersion,
          );
        this._editorDocument = editorDocument;
      }
    }
  });

  confirmMultipleEdit = task(async () => {
    if (!this.controller || !this.editorDocument) {
      return;
    }
    const fixArticleConnectionsTr = fixArticleConnections(
      this.controller.mainEditorState,
    );
    if (fixArticleConnectionsTr) {
      this.controller.mainEditorView.dispatch(fixArticleConnectionsTr);
    }
    if (!this.editorDocument.title) {
      this.hasDocumentValidationErrors = true;
    } else {
      this.hasDocumentValidationErrors = false;
      await this.documentContainer.currentVersion.reload({});
      const currentVersion = (await this.documentContainer
        .currentVersion) as EditorDocumentModel;
      const editorDocument =
        await this.documentService.createEditorDocument.perform(
          this.title as string,
          this.cleanedHtml,
          this.documentContainer,
          currentVersion,
        );
      this._editorDocument = editorDocument;
      this.showMultipleEditWarning = false;
      this.cleanedHtml = undefined;
    }
  });

  closeMultipleEditWarning = task(async () => {
    const currentVersion = (await this.documentContainer
      .currentVersion) as EditorDocumentModel;
    const inProgDocument =
      await this.documentService.createEditorDocument.perform(
        this.title as string,
        this.cleanedHtml,
        this.documentContainer,
        currentVersion,
        // Create a new document version but don't actually send it to the server
        true,
      );
    this._editorDocument = inProgDocument;
    this.showMultipleEditWarning = false;
  });

  removeEmptyDivs(html: string) {
    const parserInstance = new DOMParser();
    const parsedHtml = parserInstance.parseFromString(html, 'text/html');
    const besluitIdentifiers = {
      prefixed: 'besluit:Besluit',
      full: 'http://data.vlaanderen.be/ns/besluit#Besluit',
    };
    const besluitDivs = parsedHtml.querySelectorAll(
      `div[typeof~="${besluitIdentifiers.prefixed}"], div[typeof~="${besluitIdentifiers.full}"]`,
    );
    besluitDivs.forEach((besluitDiv) => {
      if ((besluitDiv.textContent ?? '').trim() === '') {
        besluitDiv.remove();
      }
    });

    return parsedHtml.body.innerHTML;
  }
}
