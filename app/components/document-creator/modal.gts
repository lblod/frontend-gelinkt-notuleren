import Component from '@glimmer/component';
import { service } from '@ember/service';
import { on } from '@ember/modifier';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import t from 'ember-intl/helpers/t';
import { not } from 'ember-truth-helpers';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import AuModal from '@appuniversum/ember-appuniversum/components/au-modal';
import { type BesluitTypePluginOptions } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/besluit-type-plugin/index';
import fetchBesluitTypes, {
  type BesluitType,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/besluit-type-plugin/utils/fetchBesluitTypes';
import { type BesluitTypeInstance } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/besluit-type-plugin/utils/besluit-type-instances';
import type DocumentService from 'frontend-gelinkt-notuleren/services/document-service';
import type CurrentSessionService from 'frontend-gelinkt-notuleren/services/current-session';
import { type Template } from 'frontend-gelinkt-notuleren/services/template-fetcher';
import type BestuurseenheidModel from 'frontend-gelinkt-notuleren/models/bestuurseenheid';
import TemplatePicker, { type GetTemplates } from './template-picker';
import MetadataForm from './metadata-form';

const truthy = (test: unknown) => !!test;

interface Sig {
  Args: {
    modalTitle: string;
    getTemplates: GetTemplates;
    folderId: string;
    onCancel: () => void;
    onCreate: (container: unknown, template: Template) => void;
    decisionTypeOptions?: BesluitTypePluginOptions;
  };
}

export default class DocumentCreatorModal extends Component<Sig> {
  @service declare documentService: DocumentService;
  @service declare currentSession: CurrentSessionService;
  @tracked selectedTemplate: Template | undefined;
  @tracked title = '';
  @tracked invalidTitle = false;
  @tracked decisionType?: BesluitTypeInstance;
  @tracked decisionTypes?: BesluitType[];

  constructor(owner: unknown, args: Sig['Args']) {
    super(owner, args);
    if (args.decisionTypeOptions) {
      this.decisionTypesTask.perform().catch((err) => {
        console.error('Error when fetching decision types', err);
      });
    }
  }

  get createDisabled() {
    return (
      !this.selectedTemplate ||
      this.invalidTitle ||
      !this.title ||
      (this.decisionTypes && !this.decisionType)
    );
  }

  selectTemplate = (template: Template) => {
    this.selectedTemplate = template;
  };
  deselectTemplate = () => {
    this.selectedTemplate = undefined;
  };
  setDecisionType = (selected: BesluitTypeInstance) => {
    this.decisionType = selected;
  };

  updateTitle = (title: string) => {
    this.title = title;
    if (title.trim().length > 0) {
      this.invalidTitle = false;
    } else {
      this.invalidTitle = true;
    }
  };

  onCancel = () => this.args.onCancel?.();

  create = task(async () => {
    if (this.selectedTemplate) {
      const container = await this.documentService.persistDocument.perform({
        template: this.selectedTemplate,
        title: this.title,
        folderId: this.args.folderId,
        group: this.currentSession.group as BestuurseenheidModel,
        decisionType: this.decisionType,
      });
      this.args.onCreate(container, this.selectedTemplate);
    }
  });

  decisionTypesTask = task(async () => {
    if (this.args.decisionTypeOptions) {
      const { endpoint, classificatieUri } = this.args.decisionTypeOptions;
      this.decisionTypes = await fetchBesluitTypes(classificatieUri, endpoint);
    }
  });

  <template>
    <AuModal
      @title={{@modalTitle}}
      @size='large'
      @padding='none'
      @modalOpen={{not this.selectedTemplate}}
      @closeModal={{this.onCancel}}
      as |Modal|
    >
      <Modal.Body>
        <TemplatePicker
          @getTemplates={{@getTemplates}}
          @onSelect={{this.selectTemplate}}
        />
      </Modal.Body>
    </AuModal>
    <AuModal
      @title={{@modalTitle}}
      @modalOpen={{truthy this.selectedTemplate}}
      @closeModal={{this.deselectTemplate}}
      @padding='none'
      as |Modal|
    >
      <Modal.Body>
        <AuButton
          @skin='link'
          @icon='chevron-left'
          class='au-u-padding-left'
          {{on 'click' this.deselectTemplate}}
        >
          {{t 'document-creator.back-to-selector'}}
        </AuButton>
        <MetadataForm
          @title={{this.title}}
          @invalidTitle={{this.invalidTitle}}
          @updateTitle={{this.updateTitle}}
          @selectedType={{this.decisionType}}
          @decisionTypes={{this.decisionTypes}}
          @setDecisionType={{this.setDecisionType}}
        />
      </Modal.Body>
      <Modal.Footer>
        <AuButton
          @disabled={{this.createDisabled}}
          @loading={{this.create.isRunning}}
          @loadingMessage={{t 'application.loading'}}
          {{on 'click' this.create.perform}}
        >
          {{t 'utils.create'}}
        </AuButton>
      </Modal.Footer>
    </AuModal>
  </template>
}
