import Component from '@glimmer/component';
import { action } from '@ember/object';
import { localCopy } from 'tracked-toolbox';
import { use } from 'ember-resources';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import type MandatarisModel from 'frontend-gelinkt-notuleren/models/mandataris';
import type BestuursorgaanModel from 'frontend-gelinkt-notuleren/models/bestuursorgaan';
import type ZittingModel from 'frontend-gelinkt-notuleren/models/zitting';
import type FunctionarisModel from 'frontend-gelinkt-notuleren/models/functionaris';
import type IntlService from 'ember-intl/services/intl';
import ParticipationMap from 'frontend-gelinkt-notuleren/helpers/participant-map';
import AuLabel from '@appuniversum/ember-appuniversum/components/au-label';
import AuModal from '@appuniversum/ember-appuniversum/components/au-modal';
import AuLoader from '@appuniversum/ember-appuniversum/components/au-loader';
import t from 'ember-intl/helpers/t';
import AuToolbar from '@appuniversum/ember-appuniversum/components/au-toolbar';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import { on } from '@ember/modifier';
import AuAlert from '@appuniversum/ember-appuniversum/components/au-alert';
import MandatarissenTable, { ParticipationStatus } from './mandatarissen-table';
import FunctionarisSelector from './functionaris-selector';
import { eq } from 'ember-truth-helpers';
import MandatarisSelector from './mandataris-selector';
import AuToggleSwitch from '@appuniversum/ember-appuniversum/components/au-toggle-switch';
import AuBadge from '@appuniversum/ember-appuniversum/components/au-badge';
import { InfoCircleIcon } from '@appuniversum/ember-appuniversum/components/icons/info-circle';
import WithTooltip from '../with-tooltip';

export type ParticipationInfo = {
  chairman?: MandatarisModel;
  secretary?: FunctionarisModel;
  attendees: MandatarisModel[];
  absentees: MandatarisModel[];
  unassignedMandatees: MandatarisModel[];
};
type ModalSignature = {
  Args: {
    chairman?: MandatarisModel;
    secretary?: FunctionarisModel;
    show: boolean;
    loading?: boolean;
    onCloseModal: () => unknown;
    onSave: (info: ParticipationInfo) => unknown;
    bestuursorgaan: BestuursorgaanModel;
    participants?: MandatarisModel[];
    absentees?: MandatarisModel[];
    unassignedMandatees?: MandatarisModel[];
    possibleParticipants?: MandatarisModel[];
    meeting: ZittingModel;
  };
  Blocks: {
    default: [];
  };
};
export default class ParticipationListModal extends Component<ModalSignature> {
  @localCopy('args.chairman') chairman?: MandatarisModel;
  @localCopy('args.secretary') secretary?: FunctionarisModel;
  @tracked error?: string;
  @tracked advancedMode = false;
  @service declare intl: IntlService;

  participationMap = use(
    this,
    ParticipationMap(() => ({
      active: this.args.show,
      participants: this.args.participants,
      absentees: this.args.absentees,
      unassignedMandatees: this.args.unassignedMandatees,
      possibleParticipants: this.args.possibleParticipants,
    })),
  );

  /**
   * Get a list of possible mandatees with their participation
   *
   * We use possibleParticipants here to map over cause it's already sorted.
   */
  get participants() {
    return (
      this.args.possibleParticipants?.map((participant) => ({
        person: participant,
        status:
          this.participationMap.current.get(participant) ??
          ParticipationStatus.Attending,
      })) ?? []
    );
  }

  @action
  selectChairman(mandatee: MandatarisModel) {
    this.chairman = mandatee;
    this.participationMap.current.set(mandatee, ParticipationStatus.Attending);
  }

  @action
  selectSecretary(functionaris: FunctionarisModel) {
    this.secretary = functionaris;
  }

  /**
   * Save the selected participant config and close the modal
   */
  @action
  insert() {
    this.error = undefined;
    const { attendees, absentees, unassignedMandatees } =
      this.collectParticipantsAndAbsentees();
    const info = {
      chairman: this.chairman,
      secretary: this.secretary,
      attendees,
      absentees,
      unassignedMandatees,
    };
    if (this.chairman && absentees.includes(this.chairman)) {
      this.error = this.intl.t(
        'participation-list-modal.chairman-absent-error',
      );
      return;
    }
    this.args.onSave(info);
    this.advancedMode = false;
    this.args.onCloseModal();
  }

  collectParticipantsAndAbsentees() {
    const attendees: MandatarisModel[] = [];
    const absentees: MandatarisModel[] = [];
    const unassignedMandatees: MandatarisModel[] = [];
    for (const { person, status } of this.participants) {
      switch (status) {
        case ParticipationStatus.Attending:
          attendees.push(person);
          break;
        case ParticipationStatus.Absent:
          absentees.push(person);
          break;
        case ParticipationStatus.NoMandate:
          unassignedMandatees.push(person);
      }
    }

    return { attendees, absentees, unassignedMandatees };
  }

  @action
  updateParticipationStatus(
    mandataris: MandatarisModel,
    status: ParticipationStatus,
  ) {
    this.participationMap.current.set(mandataris, status);
  }

  @action
  toggleAdvancedMode(advancedMode: boolean) {
    this.advancedMode = advancedMode;
  }

  @action
  onCancel() {
    this.chairman = this.args.chairman;
    this.secretary = this.args.secretary;
    this.advancedMode = false;
    this.args.onCloseModal();
  }

  <template>
    <AuModal
      @title='Beheer aanwezigen'
      @modalOpen={{@show}}
      @closeModal={{this.onCancel}}
      as |Modal|
    >
      <Modal.Body>
        <div class='au-o-flow'>
          <div>
            <AuLabel>
              {{t 'participation-list-modal.voorzitter-label'}}
            </AuLabel>
            <MandatarisSelector
              @onSelect={{this.selectChairman}}
              @mandataris={{this.chairman}}
              @meeting={{@meeting}}
              @bestuursorgaan={{@bestuursorgaan}}
            />
          </div>
          <div>
            <AuLabel>{{t 'participation-list-modal.secretaris-label'}}</AuLabel>
            <FunctionarisSelector
              @onSelect={{this.selectSecretary}}
              @functionaris={{this.secretary}}
              @meeting={{@meeting}}
            />
          </div>
          <div>
            <div
              class='au-u-flex au-u-flex--row au-u-flex--between au-u-margin-bottom-tiny'
            >
              <AuLabel class='au-u-margin-none'>{{t
                  'participation-list-modal.present-label'
                }}</AuLabel>
              <div class='au-u-flex au-u-flex--row au-u-flex--spaced-tiny'>

                <AuToggleSwitch
                  @checked={{this.advancedMode}}
                  @onChange={{this.toggleAdvancedMode}}
                >{{t
                    'participation-list-modal.advanced-mode.label'
                  }}</AuToggleSwitch>
                <WithTooltip
                  @tooltip={{t 'participation-list-modal.advanced-mode.help'}}
                  @placement='bottom'
                >
                  <AuBadge @icon={{InfoCircleIcon}} @size='small' />
                </WithTooltip>
              </div>

            </div>

            <MandatarissenTable
              @updateParticipationStatus={{this.updateParticipationStatus}}
              @advancedMode={{this.advancedMode}}
              as |Table|
            >
              {{#if @loading}}
                <td colspan='4'><AuLoader @hideMessage={{true}}>{{t
                      'application.loading'
                    }}</AuLoader></td>
              {{else}}
                {{#each this.participants as |participant|}}
                  <Table.Row
                    @mandataris={{participant.person}}
                    @status={{participant.status}}
                    @disabled={{eq participant.person this.chairman}}
                  />
                {{else}}
                  <td colspan='4'>{{t
                      'participation-list-modal-table.no-data-message'
                    }}</td>
                {{/each}}
              {{/if}}
            </MandatarissenTable>
          </div>
        </div>
        {{#if this.error}}
          <AuAlert
            @title={{this.error}}
            @skin='error'
            @icon='cross'
            @size='small'
          />
        {{/if}}
        {{yield}}
      </Modal.Body>
      <Modal.Footer>
        <AuToolbar as |Group|>
          <Group>
            <AuButton @skin='naked' {{on 'click' this.onCancel}}>
              {{t 'participation-list-modal.cancel-button'}}
            </AuButton>
          </Group>
          <Group>
            <AuButton {{on 'click' this.insert}}>{{t
                'participation-list-modal.save-button'
              }}</AuButton>
          </Group>
        </AuToolbar>
      </Modal.Footer>
    </AuModal>
  </template>
}
