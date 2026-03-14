import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { modifier } from 'ember-modifier';
import { trackedFunction } from 'reactiveweb/function';
import { or } from 'ember-truth-helpers';
import perform from 'ember-concurrency/helpers/perform';
import t from 'ember-intl/helpers/t';
import { on } from '@ember/modifier';
import type RouterService from '@ember/routing/router-service';
import type IntlService from 'ember-intl/services/intl';
import featureFlag from 'ember-feature-flags/helpers/feature-flag';
import AuDropdown from '@appuniversum/ember-appuniversum/components/au-dropdown';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import AuIcon from '@appuniversum/ember-appuniversum/components/au-icon';
import AuLink from '@appuniversum/ember-appuniversum/components/au-link';
import AuModal from '@appuniversum/ember-appuniversum/components/au-modal';
import type {
  ProsePlugin,
  SayController,
  Schema,
} from '@lblod/ember-rdfa-editor';
import { getActiveEditableNode } from '@lblod/ember-rdfa-editor/plugins/_private/editable-node';
import InsertArticleComponent from '@lblod/ember-rdfa-editor-lblod-plugins/components/decision-plugin/insert-article';
import type StandardTemplate from '@lblod/ember-rdfa-editor-lblod-plugins/models/template';
import { unwrap } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/option';
import { documentValidationPluginKey } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/document-validation-plugin';
import StructureControlCard from '@lblod/ember-rdfa-editor-lblod-plugins/components/structure-plugin/control-card';
import CitationInsert from '@lblod/ember-rdfa-editor-lblod-plugins/components/citation-plugin/citation-insert';
import CitationCard from '@lblod/ember-rdfa-editor-lblod-plugins/components/citation-plugin/citation-card';
import DateInsert from '@lblod/ember-rdfa-editor-lblod-plugins/components/variable-plugin/date/insert';
import DateEdit from '@lblod/ember-rdfa-editor-lblod-plugins/components/variable-plugin/date/edit';
import CodelistEdit from '@lblod/ember-rdfa-editor-lblod-plugins/components/variable-plugin/codelist/edit';
import LocationEdit from '@lblod/ember-rdfa-editor-lblod-plugins/components/variable-plugin/location/edit';
import PersonEdit from '@lblod/ember-rdfa-editor-lblod-plugins/components/variable-plugin/person/edit';
import StandardTemplateCard from '@lblod/ember-rdfa-editor-lblod-plugins/components/standard-template-plugin/card';
import TemplateCommentInsert from '@lblod/ember-rdfa-editor-lblod-plugins/components/template-comments-plugin/insert';
import TemplateCommentEdit from '@lblod/ember-rdfa-editor-lblod-plugins/components/template-comments-plugin/edit-card';
import LocationInsert from '@lblod/ember-rdfa-editor-lblod-plugins/components/location-plugin/insert';
import WorshipInsert from '@lblod/ember-rdfa-editor-lblod-plugins/components/worship-plugin/insert';
import LmbInsert from '@lblod/ember-rdfa-editor-lblod-plugins/components/lmb-plugin/insert';
import BesluitTypeToolbarDropdown from '@lblod/ember-rdfa-editor-lblod-plugins/components/besluit-type-plugin/toolbar-dropdown';
import BesluitTopicToolbarDropdown from '@lblod/ember-rdfa-editor-lblod-plugins/components/besluit-topic-plugin/besluit-topic-toolbar-dropdown';
import RoadsignRegulationCard from '@lblod/ember-rdfa-editor-lblod-plugins/components/roadsign-regulation-plugin/roadsign-regulation-card';
import LpdcInsert from '@lblod/ember-rdfa-editor-lblod-plugins/components/lpdc-plugin/lpdc-insert';
import MandateeTableInsert from '@lblod/ember-rdfa-editor-lblod-plugins/components/mandatee-table-plugin/insert';
import MandateeTableConfigure from '@lblod/ember-rdfa-editor-lblod-plugins/components/mandatee-table-plugin/configure';
import SnippetInsert from '@lblod/ember-rdfa-editor-lblod-plugins/components/snippet-plugin/snippet-insert-rdfa';
import ImportSnippetCard from '@lblod/ember-rdfa-editor-lblod-plugins/components/import-snippet-plugin/card';
import DocumentValidationCard from '@lblod/ember-rdfa-editor-lblod-plugins/components/document-validation-plugin/card';
import { TRASH_STATUS_ID } from 'frontend-gelinkt-notuleren/utils/constants';
import { fixArticleConnections } from 'frontend-gelinkt-notuleren/utils/fix-article-connections';
import type StoreService from 'frontend-gelinkt-notuleren/services/gn-store';
import type DocumentService from 'frontend-gelinkt-notuleren/services/document-service';
import type AgendapointEditorService from 'frontend-gelinkt-notuleren/services/editor/agendapoint';
import type EditorDocumentModel from 'frontend-gelinkt-notuleren/models/editor-document';
import ConceptModel from 'frontend-gelinkt-notuleren/models/concept';
import BehandelingVanAgendapunt from 'frontend-gelinkt-notuleren/models/behandeling-van-agendapunt';
import AppChrome from 'frontend-gelinkt-notuleren/components/app-chrome';
import AgendapointBackLink from 'frontend-gelinkt-notuleren/components/agendapoint-back-link';
import AgendapointMenu from 'frontend-gelinkt-notuleren/components/agendapoint-menu';
import DownloadDocument from 'frontend-gelinkt-notuleren/components/download-document';
import { DRAFT_STATUS_ID } from 'frontend-gelinkt-notuleren/utils/constants';
import type DocumentContainerModel from 'frontend-gelinkt-notuleren/models/document-container';
import RdfaEditorContainer from 'frontend-gelinkt-notuleren/components/rdfa-editor-container';
import ConfirmRouteLeave from 'frontend-gelinkt-notuleren/components/confirm-route-leave';
import ArImporterSidebarWidget from 'frontend-gelinkt-notuleren/components/editor-plugins/ar-importer/sidebar-widget';
import RegulatoryStatementsSidebarInsert from 'frontend-gelinkt-notuleren/components/editor-plugins/regulatory-statements/sidebar-insert';
import type ZittingModel from 'frontend-gelinkt-notuleren/models/zitting';

interface AgendapointEditSig {
  Args: {
    editorDocument: EditorDocumentModel | null;
    documentContainer: DocumentContainerModel;
    returnToMeeting?: ZittingModel;
    templates: StandardTemplate[];
  };
}

export default class AgendapointsEditController extends Component<AgendapointEditSig> {
  @service declare store: StoreService;
  @service declare router: RouterService;
  @service declare documentService: DocumentService;
  @service declare intl: IntlService;
  @service('editor/agendapoint')
  declare agendapointEditor: AgendapointEditorService;

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

  get config() {
    return this.agendapointEditor.config;
  }

  get nodeViews() {
    return this.agendapointEditor.nodeViews;
  }

  get dirty() {
    return this.controller?.isDirty;
  }

  get editorDocument() {
    return this._editorDocument || this.args.editorDocument;
  }

  get documentContainer() {
    return this.args.documentContainer;
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

  isNotAllowedToTrash = trackedFunction(this, async () => {
    const documentStatus = await this.documentContainer.status;
    return !documentStatus || documentStatus.id !== DRAFT_STATUS_ID;
  });

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
  async handleRdfaEditorInit(editor: SayController) {
    this.controller = editor;
    editor.initialize(this.editorDocument?.content || '', {
      doNotClean: true,
      startsDirty: false,
    });
    // Validate document
    const pluginState = documentValidationPluginKey.getState(
      this.controller.mainEditorView.state,
    );
    if (!pluginState) return;
    const { validationCallback } = pluginState;
    await validationCallback(
      this.controller.mainEditorView,
      this.controller.htmlContent,
    );
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
            'filter[document-container][:id:]': this.args.documentContainer.id,
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
        this.controller.setHtmlContent(cleanedHtml);
        this.controller.markClean();
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
    if (!this.editorDocument.title || !this.cleanedHtml) {
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
      this.controller.setHtmlContent(this.cleanedHtml);
      this.controller.markClean();
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

  <template>
    {{#if this.editorDocument}}
      <AppChrome
        @editorDocument={{this.editorDocument}}
        @documentContainer={{this.documentContainer}}
        @onTitleUpdate={{perform this.onTitleUpdate}}
        @allowTitleUpdate={{true}}
        @dirty={{this.dirty}}
      >
        <:returnLink>
          <AgendapointBackLink @meeting={{@returnToMeeting}} />
        </:returnLink>
        <:actions>
          <AgendapointMenu
            @documentContainer={{this.documentContainer}}
            @editorDocument={{this.editorDocument}}
            @meeting={{@returnToMeeting}}
          />
          <AuDropdown @title={{t 'utils.file-options'}} @alignment='right'>
            {{! template-lint-disable require-context-role }}
            <AuButton
              {{on 'click' (perform this.copyAgendapunt)}}
              @skin='link'
              role='menuitem'
            >
              <AuIcon @icon='copy' @alignment='left' />
              {{t 'app-chrome.copy-agendapoint'}}
            </AuButton>
            <DownloadDocument
              @content={{this.controller.htmlContent}}
              @document={{this.editorDocument}}
            />
            <DownloadDocument
              @content={{this.controller.htmlContent}}
              @document={{this.editorDocument}}
              @forPublish={{true}}
            />
            {{#if @returnToMeeting}}
              <AuLink @route='meetings.edit.agendapoint.copy' role='menuitem'>
                <AuIcon @icon='copy' @alignment='left' />
                {{t 'agendapoint.copy-parts-link'}}
              </AuLink>
            {{else}}
              <AuLink @route='agendapoints.copy' role='menuitem'>
                <AuIcon @icon='copy' @alignment='left' />
                {{t 'agendapoint.copy-parts-link'}}
              </AuLink>
            {{/if}}
            {{#if this.isNotAllowedToTrash.isResolved}}
              <AuButton
                {{on 'click' this.toggleDeleteModal}}
                @skin='link'
                @alert={{true}}
                role='menuitem'
                @disabled={{or this.isNotAllowedToTrash.value false}}
              >
                <AuIcon @icon='bin' @alignment='left' />
                {{t 'utils.delete'}}
              </AuButton>
            {{/if}}
          </AuDropdown>
          <AuButton
            {{on 'click' (perform this.saveTask)}}
            @disabled={{this.saveTask.isRunning}}
          >{{t 'utils.save'}}</AuButton>
        </:actions>
      </AppChrome>
    {{/if}}

    {{#if this.displayDeleteModal}}
      <AuModal
        @title={{t 'delete-modal.title'}}
        @modalOpen={{this.displayDeleteModal}}
        @closeModal={{this.toggleDeleteModal}}
        as |Modal|
      >
        <Modal.Body>
          <p>{{t 'delete-modal.restore-message'}}</p>
        </Modal.Body>
        <Modal.Footer>
          <AuButton {{on 'click' this.deleteDocument}}>{{t
              'delete-modal.confirm'
            }}</AuButton>
          <AuButton @skin='secondary' {{on 'click' this.toggleDeleteModal}}>{{t
              'delete-modal.cancel'
            }}</AuButton>
        </Modal.Footer>
      </AuModal>
    {{/if}}

    <AuModal
      @title={{t 'multiple-edit-modal.title'}}
      @modalOpen={{this.showMultipleEditWarning}}
      @closeModal={{perform this.closeMultipleEditWarning}}
      as |Modal|
    >
      <Modal.Body>
        <p>{{t 'multiple-edit-modal.message'}}</p>
      </Modal.Body>
      <Modal.Footer>
        <AuButton {{on 'click' (perform this.confirmMultipleEdit)}}>{{t
            'multiple-edit-modal.confirm'
          }}</AuButton>
        <AuButton
          @skin='secondary'
          {{on 'click' (perform this.closeMultipleEditWarning)}}
        >{{t 'multiple-edit-modal.cancel'}}</AuButton>
      </Modal.Footer>
    </AuModal>

    <div
      class='au-c-body-container au-c-body-container--scroll'
      id='panel-1'
      role='tabpanel'
      tabindex='0'
      aria-labelledby='tab-1'
      {{this.setSchemaAndPlugins}}
    >
      {{#if this.schema}}
        <RdfaEditorContainer
          @rdfaEditorInit={{this.handleRdfaEditorInit}}
          @typeOfWrappingDiv='besluit:BehandelingVanAgendapunt'
          @editorDocument={{this.editorDocument}}
          @busy={{this.isBusy}}
          @busyText={{this.busyText}}
          @schema={{this.schema}}
          {{! @glint-expect-error doesnt like the difference between SayView and EditorView }}
          @nodeViews={{this.nodeViews}}
          @plugins={{this.plugins}}
          @shouldEditRdfa={{false}}
        >
          <:toolbar as |container|>
            <div class='au-u-margin-right-small'>
              <BesluitTypeToolbarDropdown
                @controller={{container.controller}}
                @options={{this.config.besluitType}}
              />
            </div>
            <div class='au-u-margin-right-small'>
              <BesluitTopicToolbarDropdown
                @controller={{container.controller}}
                @options={{this.config.besluitTopic}}
              />
            </div>
          </:toolbar>
          <:sidebarCollapsible as |container|>
            {{! @glint-expect-error for some reason @label is required although it has a sensible default }}
            <InsertArticleComponent
              @controller={{container.controller}}
              @options={{this.config.insertArticle}}
            />
            <CitationInsert
              @controller={{container.controller}}
              @config={{this.config.citation}}
            />
            <DateInsert @controller={{container.controller}} />
            <RoadsignRegulationCard
              @controller={{container.controller}}
              @options={{this.config.roadsignRegulation}}
            />
            {{#if (featureFlag 'arImport')}}
              <ArImporterSidebarWidget @controller={{container.controller}} />
            {{/if}}
            <StandardTemplateCard
              @controller={{container.controller}}
              @templates={{@templates}}
            />
            {{#if (featureFlag 'regulatoryStatements')}}
              <RegulatoryStatementsSidebarInsert
                @controller={{container.controller}}
              />
            {{/if}}
            <TemplateCommentInsert @controller={{container.controller}} />
            <LocationInsert
              @controller={{container.controller}}
              @defaultMunicipality={{or
                this.agendapointEditor.defaultMunicipality.naam
                undefined
              }}
              @config={{this.config.location}}
            />
            <WorshipInsert
              @controller={{container.controller}}
              @config={{this.config.worship}}
            />
            <LpdcInsert
              @controller={{container.controller}}
              @config={{this.config.lpdc}}
            />
            {{#if (featureFlag 'mandateeTableEditor')}}
              <MandateeTableInsert
                @controller={{container.controller}}
                @defaultTag={{this.config.mandateeTable.defaultTag}}
              />
            {{/if}}
            <LmbInsert
              @controller={{container.controller}}
              @config={{this.config.lmb}}
            />
            {{#if this.activeNode}}
              <SnippetInsert
                @controller={{container.controller}}
                @config={{this.config.snippet}}
                @node={{this.activeNode}}
              />
            {{/if}}
          </:sidebarCollapsible>
          <:sidebar as |container|>
            <StructureControlCard @controller={{container.controller}} />
            <CitationCard
              @controller={{container.controller}}
              @config={{this.config.citation}}
            />
            <ImportSnippetCard @controller={{container.controller}} />
            <DateEdit
              @controller={{container.controller}}
              @options={{this.config.date}}
            />
            <CodelistEdit
              @controller={{container.controller}}
              @options={{this.agendapointEditor.codelistEditOptions}}
            />
            <LocationEdit
              @controller={{container.controller}}
              @options={{this.agendapointEditor.locationEditOptions}}
            />
            <PersonEdit
              @controller={{container.controller}}
              @config={{this.config.lmb}}
            />
            <TemplateCommentEdit @controller={{container.controller}} />
            {{#if (featureFlag 'mandateeTableEditor')}}
              <MandateeTableConfigure
                @controller={{container.controller}}
                @supportedTags={{this.config.mandateeTable.tags}}
              />
            {{/if}}
            <DocumentValidationCard @controller={{container.controller}} />
          </:sidebar>
        </RdfaEditorContainer>
      {{/if}}
    </div>
    <ConfirmRouteLeave
      @enabled={{this.dirty}}
      @message={{t 'behandeling-van-agendapunten.confirm-leave-without-saving'}}
    />
  </template>
}
