import Component from '@glimmer/component';
import { service } from '@ember/service';
import { on } from '@ember/modifier';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import t from 'ember-intl/helpers/t';
import { not } from 'ember-truth-helpers';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import AuModal from '@appuniversum/ember-appuniversum/components/au-modal';
import TemplatePicker, { type GetTemplates } from './template-picker';
import type DocumentService from '../../services/document-service';
import type CurrentSessionService from '../../services/current-session';
import MetadataForm from './metadata-form';
import type { Template } from '../../services/template-fetcher';
import type BestuurseenheidModel from 'frontend-gelinkt-notuleren/models/bestuurseenheid';

const truthy = (test: unknown) => !!test;

interface Sig {
  Args: {
    modalTitle: string;
    getTemplates: GetTemplates;
    folderId: string;
    onCancel: () => void;
    onCreate: (container: unknown, template: Template) => void;
  };
}

export default class DocumentCreatorModal extends Component<Sig> {
  @service declare store: object;
  @service declare documentService: DocumentService;
  @service declare currentSession: CurrentSessionService;

  @tracked selectedTemplate: Template | undefined;

  selectTemplate = (template: Template) => {
    this.selectedTemplate = template;
  };
  deselectTemplate = () => {
    this.selectedTemplate = undefined;
  };

  @tracked title = '';
  @tracked invalidTitle = false;

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
      });
      this.args.onCreate(container, this.selectedTemplate);
    }
  });
  get createDisabled() {
    return !this.selectedTemplate || this.invalidTitle || !this.title;
  }

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
