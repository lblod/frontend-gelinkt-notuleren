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

import ParticipationListModal from './participation-list/modal';
import type ZittingModel from 'frontend-gelinkt-notuleren/models/zitting';

type Signature = {
  Args: {
    chairman: Option<MandatarisModel>;
    defaultChairman: Option<MandatarisModel>;
    secretary: Option<FunctionarisModel>;
    defaultSecretary: Option<FunctionarisModel>;
    participants: Option<MandatarisModel[]>;
    defaultParticipants: Option<MandatarisModel[]>;
    absentees: Option<MandatarisModel[]>;
    defaultAbsentees: Option<MandatarisModel[]>;
    possibleParticipants: Option<MandatarisModel[]>;
    bestuursorgaan: BestuursorgaanModel;
    onSave: (info: unknown) => unknown;
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

  get defaultedChairman() {
    return this.chairman ?? this.args.defaultChairman;
  }

  get defaultedSecretary() {
    return this.secretary ?? this.args.defaultSecretary;
  }

  get participantsEmpty() {
    return !this.args.participants?.length && !this.args.absentees?.length;
  }

  get participants() {
    return this.args.participants;
  }

  get defaultedParticipants() {
    if (!this.participants || this.participantsEmpty) {
      return this.args.defaultParticipants;
    }
    return this.participants;
  }

  get absentees() {
    return this.args.absentees;
  }

  get defaultedAbsentees() {
    if (!this.absentees || this.participantsEmpty) {
      return this.args.defaultAbsentees;
    }
    return this.absentees;
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
    ];
  }

  <template>
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
      @chairman={{this.defaultedChairman}}
      {{! @glint-expect-error fix the types for this component }}
      @secretary={{this.defaultedSecretary}}
      {{! @glint-expect-error fix the types for this component }}
      @participants={{this.defaultedParticipants}}
      {{! @glint-expect-error fix the types for this component }}
      @absentees={{this.defaultedAbsentees}}
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
