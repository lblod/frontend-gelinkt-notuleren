import Component from '@glimmer/component';
import { PUBLISHED_STATUS_ID } from '../utils/constants';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { trackedFunction } from 'reactiveweb/function';
import InstallatieVergaderingModel from '../models/installatievergadering';
import { PLANNED_STATUS_ID } from 'frontend-gelinkt-notuleren/utils/constants';
import Store from 'frontend-gelinkt-notuleren/services/store';
import type RouterService from '@ember/routing/router-service';
import type IntlService from 'ember-intl/services/intl';
import type EditStemmingService from 'frontend-gelinkt-notuleren/services/edit-stemming';
import type DocumentService from 'frontend-gelinkt-notuleren/services/document-service';
import type CurrentSessionService from 'frontend-gelinkt-notuleren/services/current-session';
import type ZittingModel from 'frontend-gelinkt-notuleren/models/zitting';
import type BehandelingVanAgendapunt from 'frontend-gelinkt-notuleren/models/behandeling-van-agendapunt';
import AuHeading from '@appuniversum/ember-appuniversum/components/au-heading';
import AuPill from '@appuniversum/ember-appuniversum/components/au-pill';
import MeetingSubSection from './common/meeting-sub-section';
import AuLabel from '@appuniversum/ember-appuniversum/components/au-label';
import { Input } from '@ember/component';
import { on } from '@ember/modifier';
import AuLoader from '@appuniversum/ember-appuniversum/components/au-loader';
import t from 'ember-intl/helpers/t';
import AuToolbar from '@appuniversum/ember-appuniversum/components/au-toolbar';
import ParticipationList, { type ParticipantInfo } from './participation-list';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import { and, not, or } from 'ember-truth-helpers';
import AuLink from '@appuniversum/ember-appuniversum/components/au-link';
import { hash } from '@ember/helper';
import type FunctionarisModel from 'frontend-gelinkt-notuleren/models/functionaris';
import type MandatarisModel from 'frontend-gelinkt-notuleren/models/mandataris';
import StemmingModel from 'frontend-gelinkt-notuleren/models/stemming';
import DocumentContainerModel from 'frontend-gelinkt-notuleren/models/document-container';
import CustomVotingModel from 'frontend-gelinkt-notuleren/models/custom-voting';
import limitContent from 'frontend-gelinkt-notuleren/helpers/limit-content';
import { uniqueId } from '@ember/helper';
import type BestuursorgaanModel from 'frontend-gelinkt-notuleren/models/bestuursorgaan';
import TreatmentVoting from './treatment/voting';
import TreatmentVotingEdit from './treatment/voting/edit';
type Signature = {
  Args: {
    meeting: ZittingModel;
    behandeling: BehandelingVanAgendapunt;
    readOnly?: boolean;
    focusMode?: boolean;
    possibleParticipants?: MandatarisModel[];
    bestuursorgaan: BestuursorgaanModel;
    loadingParticipants?: boolean;
  };
};

export default class BehandelingVanAgendapuntComponent extends Component<Signature> {
  @service declare store: Store;
  @service declare router: RouterService;
  @service declare intl: IntlService;
  @service declare editStemming: EditStemmingService;
  @service declare documentService: DocumentService;
  @service declare currentSession: CurrentSessionService;

  @tracked published = false;
  @tracked chairman?: MandatarisModel | null;
  @tracked secretary?: FunctionarisModel | null;

  @tracked editMode = false;

  meetingChairmanRequest = trackedFunction(this, async () => {
    return this.args.meeting.voorzitter;
  });

  meetingSecretaryRequest = trackedFunction(this, async () => {
    return this.args.meeting.secretaris;
  });

  meetingParticipantsRequest = trackedFunction(this, async () => {
    return this.args.meeting.aanwezigenBijStart;
  });

  meetingAbsenteesRequest = trackedFunction(this, async () => {
    return this.args.meeting.afwezigenBijStart;
  });

  constructor(owner: unknown, args: Signature['Args']) {
    super(owner, args);
    void this.fetchParticipants.perform();
    void this.getStatus.perform();
  }

  attachmentData = trackedFunction(this, async () => {
    const container = await this.behandeling?.documentContainer;
    const attachments = await container?.attachments;
    return attachments;
  });

  get attachments() {
    return this.attachmentData.value ?? [];
  }

  get behandeling() {
    return this.args.behandeling;
  }

  get stemmingen() {
    return this.args.behandeling.sortedVotings ?? [];
  }

  get editable() {
    return !(this.published || this.args.readOnly);
  }

  get canEditParticipants() {
    if (this.behandeling) {
      return this.behandeling.stemmingen.length === 0;
    } else {
      return false;
    }
  }

  get openbaar() {
    return this.behandeling?.openbaar;
  }

  set openbaar(value) {
    if (this.behandeling) {
      this.behandeling.openbaar = value;
    }
  }

  get defaultParticipants() {
    return this.meetingParticipantsRequest.value;
  }

  get defaultAbsentees() {
    return this.meetingAbsenteesRequest.value;
  }
  get participants() {
    return this.behandeling?.sortedParticipants ?? [];
  }
  get absentees() {
    return this.behandeling?.sortedAbsentees ?? [];
  }

  get hasParticipants() {
    return this.participants.length;
  }

  get isLoading() {
    return (
      this.fetchParticipants.isRunning ||
      this.meetingChairmanRequest.isPending ||
      this.meetingSecretaryRequest.isPending
    );
  }

  get defaultChairman() {
    return this.meetingChairmanRequest.value;
  }

  get defaultSecretary() {
    return this.meetingSecretaryRequest.value;
  }

  get isInaugurationMeeting() {
    return this.args.meeting instanceof InstallatieVergaderingModel;
  }

  getStatus = task(async () => {
    const container = await this.behandeling?.documentContainer;
    if (container) {
      const status = await container.status;
      const statusId = status?.id;

      if (statusId === PUBLISHED_STATUS_ID) {
        this.published = true;
      }
    }
  });

  /**
   * @param {ParticipantInfo} info
   */
  @action
  async saveParticipants({
    chairman,
    secretary,
    participants,
    absentees,
  }: ParticipantInfo) {
    if (this.behandeling) {
      this.behandeling.set('voorzitter', chairman);
      this.chairman = chairman;

      this.behandeling.set('secretaris', secretary);
      this.secretary = secretary;

      this.behandeling.set('aanwezigen', participants);
      this.behandeling.set('afwezigen', absentees);

      await this.behandeling.save();
    }
  }

  fetchParticipants = task(async () => {
    if (this.behandeling) {
      this.chairman = await this.behandeling.voorzitter;
      this.secretary = await this.behandeling.secretaris;
    }
  });

  toggleOpenbaar = task(async (event: Event) => {
    if (
      this.behandeling &&
      event.target instanceof HTMLInputElement &&
      event.target.type === 'checkbox'
    ) {
      const openbaar = event.target.checked;
      this.behandeling.openbaar = openbaar;
      await this.behandeling.save();
    }
  });

  @action
  onCancelEdit() {
    this.editMode = false;
    this.editStemming.stemming?.rollbackAttributes();
    this.editStemming.stemming = null;
  }

  saveStemming = task(async () => {
    if (!this.editStemming.stemming) {
      return;
    }
    const isNew = this.editStemming.stemming.isNew;

    if (isNew) {
      this.editStemming.stemming.position = this.stemmingen.length;
      this.editStemming.stemming.set(
        'behandelingVanAgendapunt',
        this.args.behandeling,
      );
    }
    await this.editStemming.saveTask.perform();
    this.onCancelEdit();
  });

  addStandardVoting = task(async () => {
    // high pagesize is set on the model, so this is fine
    const participants = await this.args.behandeling.aanwezigen;

    const stemmingToEdit = this.store.createRecord<StemmingModel>('stemming', {
      onderwerp: '',
      geheim: false,
      aantalVoorstanders: 0,
      aantalTegenstanders: 0,
      aantalOnthouders: 0,
      gevolg: '',
    });
    this.editMode = true;
    (await stemmingToEdit.aanwezigen).push(...participants);
    (await stemmingToEdit.stemmers).push(...participants);
    this.editStemming.stemming = stemmingToEdit;
  });

  addCustomVoting = task(async () => {
    const container = this.store.createRecord<DocumentContainerModel>(
      'document-container',
      {},
    );

    const status = await this.store.findRecord('concept', PLANNED_STATUS_ID);
    container.set('status', status);

    const folder = await this.store.findRecord(
      'editor-document-folder',
      '39fa1367-93dc-4025-af7b-4db8c7029dc3',
    );
    container.set('folder', folder);

    container.set('publisher', this.currentSession.group);

    const editorDocument =
      await this.documentService.createEditorDocument.perform(
        this.intl.t('custom-voting.document-title'),
        '',
        container,
      );
    container.set('currentVersion', editorDocument);

    await container.save();

    const stemmingToEdit = this.store.createRecord<CustomVotingModel>(
      'custom-voting',
      {
        votingDocument: container,
        behandelingVanAgendapunt: this.args.behandeling,
        position: this.stemmingen.length,
      },
    );
    await stemmingToEdit.save();

    this.router.transitionTo('meetings.edit.custom-voting', stemmingToEdit.id);
  });

  <template>
    {{#if this.editable}}
      <div class='au-c-meeting-chrome-editable'>
        <div
          class='au-u-flex au-u-flex--spaced-small au-u-flex--row au-u-flex--vertical-center'
        >
          <AuHeading id='behandeling-{{@behandeling.id}}' @level='3' @skin='4'>
            {{! @glint-expect-error Properly await this }}
            {{limitContent @behandeling.onderwerp.titel 80}}
          </AuHeading>
          {{#if this.isInaugurationMeeting}}
            <AuPill
              @icon='alert-triangle'
              @skin='warning'
              class='au-u-hide-on-print'
            >
              {{t 'behandeling-van-agendapunten.sync-warning'}}
            </AuPill>
          {{/if}}
        </div>
        {{#unless @focusMode}}
          <MeetingSubSection
            @title={{t 'behandeling-van-agendapunten.visibility'}}
            class='au-u-hide-on-print'
          >
            <:body>
              <div class='au-u-padding-tiny au-u-padding-bottom-none'>
                {{#let (uniqueId) as |id|}}
                  <AuLabel for={{id}}><Input
                      @type='checkbox'
                      @checked={{this.openbaar}}
                      {{on 'input' this.toggleOpenbaar.perform}}
                      id={{id}}
                    />
                    &nbsp;{{t 'behandeling-van-agendapunten.openbaar-label'}}
                  </AuLabel>
                {{/let}}
                {{#if this.toggleOpenbaar.isRunning}}
                  <AuLoader @padding='small' @hideMessage={{true}}>{{t
                      'application.loading'
                    }}</AuLoader>
                {{/if}}
              </div>
            </:body>
          </MeetingSubSection>
        {{/unless}}
      </div>
    {{else}}
      <div class='au-c-meeting-chrome-editable'>
        <AuToolbar>
          <AuHeading id='behandeling-{{@behandeling.id}}' @level='3' @skin='4'>
            {{! @glint-expect-error Properly await this }}
            {{limitContent @behandeling.onderwerp.titel 80}}
          </AuHeading>
          {{#if this.published}}
            <AuPill @skin='success'>
              {{t 'manage-agenda-zitting-modal.ap-published-msg'}}
            </AuPill>
          {{/if}}
        </AuToolbar>
        {{#unless @focusMode}}
          <MeetingSubSection
            @title={{t 'behandeling-van-agendapunten.visibility'}}
          >
            <:body>
              <div class='au-u-padding-tiny'>
                <AuPill @skin='border'>
                  {{#if this.openbaar}}
                    {{t 'behandeling-van-agendapunten.openbaar-msg'}}
                  {{else}}
                    {{t 'behandeling-van-agendapunten.geen-openbaar-msg'}}
                  {{/if}}
                </AuPill>
              </div>
            </:body>
          </MeetingSubSection>
        {{/unless}}
      </div>

    {{/if}}
    {{#unless @focusMode}}
      {{#if this.isLoading}}
        <AuLoader @centered={{false}}>{{t
            'participation-list.loading-title'
          }}</AuLoader>
      {{else}}
        <ParticipationList
          @chairman={{this.chairman}}
          @defaultChairman={{this.defaultChairman}}
          @secretary={{this.secretary}}
          @defaultSecretary={{this.defaultSecretary}}
          @participants={{this.participants}}
          @defaultParticipants={{this.defaultParticipants}}
          @absentees={{this.absentees}}
          @defaultAbsentees={{this.defaultAbsentees}}
          @possibleParticipants={{@possibleParticipants}}
          @bestuursorgaan={{@bestuursorgaan}}
          @onSave={{this.saveParticipants}}
          @meeting={{@meeting}}
          @modalTitle={{t 'generic.edit'}}
          @readOnly={{or (not this.editable) (not this.canEditParticipants)}}
          @readOnlyText={{unless
            this.canEditParticipants
            (t 'behandeling-van-agendapunten.cannot-edit-participants')
          }}
          @loading={{@loadingParticipants}}
        />
      {{/if}}
      <MeetingSubSection
        @title={{t 'behandeling-van-agendapunten.voting-title'}}
      >
        <:body>
          {{#if this.hasParticipants}}
            <TreatmentVoting
              @bestuursorgaan={{@bestuursorgaan}}
              @behandeling={{@behandeling}}
              @readOnly={{not this.editable}}
            />
          {{else}}
            <div
              class='au-u-margin-top au-u-margin-bottom au-u-flex au-u-flex--center'
            >
              <AuPill
                @skin='warning'
                @icon='alert-triangle'
                @iconAlignment='left'
              >
                {{t 'behandeling-van-agendapunten.needs-participants'}}
              </AuPill>
            </div>
          {{/if}}
        </:body>
        <:button>
          {{#unless @readOnly}}
            <div class='au-u-hide-on-print'>

              <AuButton
                {{on 'click' this.addStandardVoting.perform}}
                @icon='add'
                @skin='secondary'
                @iconAlignment='left'
                @disabled={{not (and this.hasParticipants this.editable)}}
                @loading={{this.addStandardVoting.isRunning}}
                @loadingMessage={{t 'application.loading'}}
              >
                {{t 'generic.add'}}
              </AuButton>
              <AuButton
                {{on 'click' this.addCustomVoting.perform}}
                @icon='add'
                @skin='secondary'
                @iconAlignment='left'
                @disabled={{not (and this.hasParticipants this.editable)}}
                @loading={{this.addCustomVoting.isRunning}}
                @loadingMessage={{t 'application.loading'}}
              >
                {{t 'behandeling-van-agendapunten.add-custom-voting'}}
              </AuButton>
              {{#if this.editMode}}
                <TreatmentVotingEdit
                  @bestuursorgaan={{@bestuursorgaan}}
                  @onSave={{this.saveStemming.perform}}
                  @onCancel={{this.onCancelEdit}}
                  @saving={{this.saveStemming.isRunning}}
                />
              {{/if}}
            </div>
          {{/unless}}
        </:button>
      </MeetingSubSection>
    {{/unless}}
    <MeetingSubSection
      @title={{t 'behandeling-van-agendapunten.content-title'}}
    >
      <:body>
        {{#if this.attachments}}
          {{#if this.editable}}
            <AuPill
              @route='agendapoints.attachments'
              @model={{@behandeling.documentContainer.id}}
              @query={{hash returnToMeeting=@meeting.id}}
              @skin='link'
              @icon='attachment'
              @iconAlignment='left'
            >
              {{this.attachments.length}}
            </AuPill>
          {{else}}
            <AuPill @skin='border' @icon='attachment' @iconAlignment='left'>
              {{this.attachments.length}}
            </AuPill>
          {{/if}}
        {{/if}}
        <div class='au-o-box au-o-box--small au-c-editor-preview say-content'>
          {{! @glint-expect-error properly await this }}
          {{@behandeling.documentContainer.currentVersion.htmlSafeContent}}
        </div>
      </:body>

      <:button>
        {{#if (and this.editable @behandeling.documentContainer)}}
          <AuLink
            @route='agendapoints.edit'
            @model={{@behandeling.documentContainer.id}}
            @query={{hash returnToMeeting=@meeting.id}}
            @skin='button-secondary'
            @icon='pencil'
            @iconAlignment='left'
            class='au-u-hide-on-print'
          >
            {{t 'generic.edit'}}
          </AuLink>
        {{/if}}
      </:button>
    </MeetingSubSection>
  </template>
}
