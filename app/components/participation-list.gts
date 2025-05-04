import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import type { Option } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/option';
import type IntlService from 'ember-intl/services/intl';
import type BestuursorgaanModel from 'frontend-gelinkt-notuleren/models/bestuursorgaan';
import type FunctionarisModel from 'frontend-gelinkt-notuleren/models/functionaris';
import type MandatarisModel from 'frontend-gelinkt-notuleren/models/mandataris';
import { tracked } from 'tracked-built-ins';
import MeetingSubSection from './common/meeting-sub-section';
import DetailsList from './common/details-list';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import t from 'ember-intl/helpers/t';
import { on } from '@ember/modifier';
import { and } from 'ember-truth-helpers';

import ParticipationListModal, {
  type ParticipationInfo,
} from './participation-list/modal';
import type ZittingModel from 'frontend-gelinkt-notuleren/models/zitting';
import type { AttendanceValidationResult } from 'frontend-gelinkt-notuleren/services/meeting';
import AuAlert, {
  type AuAlertSignature,
} from '@appuniversum/ember-appuniversum/components/au-alert';
import AuList from '@appuniversum/ember-appuniversum/components/au-list';
import AuLinkExternal from '@appuniversum/ember-appuniversum/components/au-link-external';

type Signature = {
  Args: {
    chairman?: Option<MandatarisModel>;
    defaultChairman?: Option<MandatarisModel>;
    secretary?: Option<FunctionarisModel>;
    defaultSecretary?: Option<FunctionarisModel>;
    participants?: Option<MandatarisModel[]>;
    defaultParticipants?: Option<MandatarisModel[]>;
    absentees?: Option<MandatarisModel[]>;
    defaultAbsentees?: Option<MandatarisModel[]>;
    unassignedMandatees?: Option<MandatarisModel[]>;
    defaultUnassignedMandatees?: Option<MandatarisModel[]>;
    possibleParticipants?: Option<MandatarisModel[]>;
    attendanceValidationResult?: AttendanceValidationResult;
    bestuursorgaan: BestuursorgaanModel;
    onSave: (info: ParticipationInfo) => unknown;
    meeting: ZittingModel;
    modalTitle: string;
    readOnly: boolean;
    readOnlyText?: string;
    loading?: boolean;
  };
};

export default class ParticipationList extends Component<Signature> {
  @service declare intl: IntlService;

  @tracked popup = false;

  get secretary() {
    return this.args.secretary;
  }

  get chairman() {
    return this.args.chairman;
  }

  get defaultChairman() {
    return this.chairman ?? this.args.defaultChairman;
  }

  get defaultSecretary() {
    return this.secretary ?? this.args.defaultSecretary;
  }

  get participantsEmpty() {
    return (
      !this.args.participants?.length &&
      !this.args.absentees?.length &&
      !this.args.unassignedMandatees?.length
    );
  }

  get participants() {
    return this.args.participants;
  }

  get defaultParticipants() {
    if (!this.participants || this.participantsEmpty) {
      return this.args.defaultParticipants;
    }
    return this.participants;
  }

  get absentees() {
    return this.args.absentees;
  }

  get defaultAbsentees() {
    if (!this.absentees || this.participantsEmpty) {
      return this.args.defaultAbsentees;
    }
    return this.absentees;
  }

  get unassignedMandatees() {
    return this.args.unassignedMandatees;
  }

  get defaultUnassignedMandatees() {
    if (!this.unassignedMandatees || this.participantsEmpty) {
      return this.args.defaultUnassignedMandatees;
    }
    return this.unassignedMandatees;
  }

  @action
  togglePopup() {
    this.popup = !this.popup;
  }

  get detailsListItems() {
    return [
      {
        label: this.intl.t('participation-list.voorzitter-label'),
        // TODO: rework this
        value: this.chairman?.get('isBestuurlijkeAliasVan.fullName') as
          | string
          | undefined,
        pill: !this.chairman
          ? ({
              skin: 'warning',
              icon: 'alert-triangle',
              text: this.intl.t('participation-list.voorzitter-error'),
            } as const)
          : undefined,
      },
      {
        label: this.intl.t('participation-list.secretaris-label'),
        // TODO: rework this
        value: this.secretary?.get('isBestuurlijkeAliasVan.fullName') as
          | string
          | undefined,
        pill: !this.secretary
          ? ({
              skin: 'warning',
              icon: 'alert-triangle',
              text: this.intl.t('participation-list.secretaris-error'),
            } as const)
          : undefined,
      },
      {
        label: this.intl.t('participation-list.present-label'),
        // TODO: rework this
        value: this.participants
          ?.map((m) => m.get('isBestuurlijkeAliasVan.fullName'))
          .join(', '),
        pill: !this.participants?.length
          ? ({
              skin: 'warning',
              icon: 'alert-triangle',
              text: this.intl.t('participation-list.present-error'),
            } as const)
          : undefined,
      },
      {
        label: this.intl.t('participation-list.not-present-label'),
        // TODO: rework this
        value:
          this.absentees
            ?.map((m) => m.get('isBestuurlijkeAliasVan.fullName'))
            .join(', ') || '',
      },
      ...(this.unassignedMandatees?.length
        ? [
            {
              label: this.intl.t('participation-list.unassigned-label'),
              // TODO: rework this
              value:
                this.unassignedMandatees
                  ?.map((m) => m.get('isBestuurlijkeAliasVan.fullName'))
                  .join(', ') || '',
            },
          ]
        : []),
    ];
  }

  <template>
    {{#if @attendanceValidationResult}}
      <UnassignedMandateesBanner
        @attendanceValidationResult={{@attendanceValidationResult}}
      />
    {{/if}}
    <MeetingSubSection @title={{t 'participation-list.block-title'}}>
      <:body>
        <DetailsList @items={{this.detailsListItems}} />
      </:body>
      <:button>
        {{#unless @readOnly}}
          <AuButton
            @skin='secondary'
            @icon='pencil'
            @iconAlignment='left'
            {{on 'click' this.togglePopup}}
            class='au-u-margin-top-small au-u-hide-on-print'
          >
            {{@modalTitle}}
          </AuButton>
        {{/unless}}
        {{#if (and @readOnly @readOnlyText)}}
          <AuButton
            @skin='secondary'
            @icon='cross'
            @iconAlignment='left'
            class='au-u-margin-top-small au-u-hide-on-print'
            @disabled={{true}}
          >
            {{@readOnlyText}}
          </AuButton>
        {{/if}}
      </:button>
    </MeetingSubSection>
    <ParticipationListModal
      {{! @glint-expect-error fix the types for this component }}
      @chairman={{this.defaultChairman}}
      {{! @glint-expect-error fix the types for this component }}
      @secretary={{this.defaultSecretary}}
      {{! @glint-expect-error fix the types for this component }}
      @participants={{this.defaultParticipants}}
      {{! @glint-expect-error fix the types for this component }}
      @absentees={{this.defaultAbsentees}}
      {{! @glint-expect-error fix the types for this component }}
      @unassignedMandatees={{this.defaultUnassignedMandatees}}
      {{! @glint-expect-error fix the types for this component }}
      @possibleParticipants={{@possibleParticipants}}
      @show={{this.popup}}
      @onCloseModal={{this.togglePopup}}
      @onSave={{@onSave}}
      @bestuursorgaan={{@bestuursorgaan}}
      @meeting={{@meeting}}
      @loading={{@loading}}
    />
  </template>
}

type UnassignedMandateesBannerSignature = {
  Args: {
    attendanceValidationResult: AttendanceValidationResult;
  };
  Element: AuAlertSignature['Element'];
};
class UnassignedMandateesBanner extends Component<UnassignedMandateesBannerSignature> {
  get attendanceValidation() {
    return this.args.attendanceValidationResult;
  }

  get shouldShow() {
    return (
      !this.attendanceValidation.ok &&
      this.attendanceValidation.filledIn &&
      this.attendanceValidation.unassignedMandatees.length
    );
  }

  <template>
    {{#if this.shouldShow}}
      <AuAlert
        ...attributes
        @title={{t 'participation-list.unassigned-mandatees-warning.title'}}
        @skin='warning'
        @size='small'
        @icon='alert-triangle'
      >
        {{t 'participation-list.unassigned-mandatees-warning.first-line'}}
        <AuList
          class='au-u-margin-top-tiny au-u-margin-bottom-tiny'
          @divider={{true}}
          as |Item|
        >
          {{#each this.attendanceValidation.unassignedMandatees as |mandatee|}}
            <Item>
              <AuLinkExternal @skin='primary' href={{mandatee.uri}}>
                {{! @glint-expect-error we should properly await this }}
                {{mandatee.isBestuurlijkeAliasVan.fullName}}
              </AuLinkExternal>

            </Item>
          {{/each}}
        </AuList>
        {{t 'participation-list.unassigned-mandatees-warning.second-line'}}
      </AuAlert>
    {{/if}}
  </template>
}
