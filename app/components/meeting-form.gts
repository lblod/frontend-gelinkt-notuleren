/**
 * Ember
 */
import Component from '@glimmer/component';
import { tracked, TrackedArray } from 'tracked-built-ins';
import { service } from '@ember/service';
import { action, get } from '@ember/object';

/**
 * Services
 */
import type IntlService from 'ember-intl/services/intl';
import type RouterService from '@ember/routing/router-service';
import type CurrentSessionService from 'frontend-gelinkt-notuleren/services/current-session';
import type Store from 'frontend-gelinkt-notuleren/services/store';

/**
 * Helpers/modifiers
 */
// eslint-disable-next-line ember/no-at-ember-render-modifiers
import didInsert from '@ember/render-modifiers/modifiers/did-insert';
import { and, not, or } from 'ember-truth-helpers';
import { on } from '@ember/modifier';
import t from 'ember-intl/helpers/t';
import { unwrap } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/option';
import { htmlSafe } from '@ember/template';
import { detailedDate } from 'frontend-gelinkt-notuleren/utils/detailed-date';
import plainDate from 'frontend-gelinkt-notuleren/helpers/plain-date';
import { add } from 'ember-math-helpers';

/**
 * Task/state management
 */
import { trackedFunction } from 'reactiveweb/function';
import { trackedTask } from 'reactiveweb/ember-concurrency';
import { all, restartableTask, task } from 'ember-concurrency';

/**
 * Ember-data models
 */
import type VersionedNotulenModel from 'frontend-gelinkt-notuleren/models/versioned-notulen';
import type MandatarisModel from 'frontend-gelinkt-notuleren/models/mandataris';
import type FunctionarisModel from 'frontend-gelinkt-notuleren/models/functionaris';
import type BestuursorgaanModel from 'frontend-gelinkt-notuleren/models/bestuursorgaan';
import BehandelingVanAgendapunt from 'frontend-gelinkt-notuleren/models/behandeling-van-agendapunt';
import InstallatieVergaderingModel from 'frontend-gelinkt-notuleren/models/installatievergadering';
import type InstallatieVergaderingSynchronizationStatusModel from 'frontend-gelinkt-notuleren/models/installatievergadering-synchronization-status';
import type BestuursfunctieCodeModel from 'frontend-gelinkt-notuleren/models/bestuursfunctie-code';
import type ZittingModel from 'frontend-gelinkt-notuleren/models/zitting';
import type { LegacyResourceQuery } from '@ember-data/store/types';

/**
 * Constants
 */
import { articlesBasedOnClassifcationMap } from 'frontend-gelinkt-notuleren/utils/classification-utils';
import {
  MANDATARIS_STATUS_EFFECTIEF,
  MANDATARIS_STATUS_WAARNEMEND,
} from 'frontend-gelinkt-notuleren/utils/constants';

/**
 * Components
 */
import AuCard from '@appuniversum/ember-appuniversum/components/au-card';
import AuToolbar from '@appuniversum/ember-appuniversum/components/au-toolbar';
import AuLink from '@appuniversum/ember-appuniversum/components/au-link';
import AuPill from '@appuniversum/ember-appuniversum/components/au-pill';
import AuDropdown from '@appuniversum/ember-appuniversum/components/au-dropdown';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import AuIcon from '@appuniversum/ember-appuniversum/components/au-icon';
import AuHr from '@appuniversum/ember-appuniversum/components/au-hr';
import AuToggleSwitch from '@appuniversum/ember-appuniversum/components/au-toggle-switch';
import AuHelpText from '@appuniversum/ember-appuniversum/components/au-help-text';
import AuHeading from '@appuniversum/ember-appuniversum/components/au-heading';
import AuLoader from '@appuniversum/ember-appuniversum/components/au-loader';
import AuList from '@appuniversum/ember-appuniversum/components/au-list';
import AuBadge from '@appuniversum/ember-appuniversum/components/au-badge';

import MeetingSection from './common/meeting-section';
import MeetingSubSection from './common/meeting-sub-section';
import ReadonlyTextBox from './readonly-text-box';
import InaugurationMeetingSynchronization from './inauguration-meeting/synchronization';
import DeleteMeetingModal from './delete-meeting-modal';
import WithTooltip from './with-tooltip';
import ParticipationList from './participation-list';
import ManageZittingsdata from './zitting/manage-zittingsdata';
import ManageIntermissions from './manage-intermissions';
import BehandelingVanAgendapuntComponent from './behandeling-van-agendapunt';
import AgendaManager from './agenda-manager';
import type MeetingService from 'frontend-gelinkt-notuleren/services/meeting';
import type { MeetingValidationResult } from 'frontend-gelinkt-notuleren/services/meeting';
import type { TOC } from '@ember/component/template-only';
import AuLinkExternal from '@appuniversum/ember-appuniversum/components/au-link-external';
import { concat } from '@ember/helper';
import AuAlert from '@appuniversum/ember-appuniversum/components/au-alert';
import type { ParticipationInfo } from './participation-list/modal';
import type UserPreferencesService from 'frontend-gelinkt-notuleren/services/user-preferences';
import { localCopy } from 'tracked-toolbox';

type Signature = {
  Args: {
    zitting: ZittingModel;
    focused: boolean;
  };
};
export default class MeetingForm extends Component<Signature> {
  @tracked showDeleteModal: boolean = false;
  behandelingen: TrackedArray<BehandelingVanAgendapunt> = tracked([]);
  @service declare store: Store;
  @service declare currentSession: CurrentSessionService;
  @service declare router: RouterService;
  @service declare intl: IntlService;
  @service('meeting') declare meetingService: MeetingService;

  validation = trackedFunction(this, async () => {
    const zitting = this.zitting;
    const possibleParticipants = await this.possibleParticipantsData;
    const validationResult = await this.meetingService.validateMeeting(
      zitting,
      possibleParticipants,
    );
    return validationResult;
  });

  isPublished = trackedFunction(this, async () => {
    // This is needed here, see https://github.com/NullVoxPopuli/ember-resources/issues/340
    await Promise.resolve();
    const publishedNotulen = (await this.store.query('versioned-notulen', {
      'filter[zitting][id]': this.zitting.id,
      'filter[:has:published-resource]': 'yes',
      'fields[versioned-notulen]': 'id',
    })) as VersionedNotulenModel[];
    return !!publishedNotulen[0];
  });

  canBeDeleted = trackedFunction(this, async () => {
    // This is needed here, see https://github.com/NullVoxPopuli/ember-resources/issues/340
    await Promise.resolve();
    const publicationFilter = {
      filter: {
        state: 'gepubliceerd',
        zitting: {
          id: this.zitting.id,
        },
      },
    };
    try {
      const versionedNotulen = await this.store.query(
        'versioned-notulen',
        publicationFilter,
      );
      const versionedBesluitenLijsten = await this.store.query(
        'versioned-besluiten-lijst',
        publicationFilter,
      );
      const versionedBehandelingen = await this.store.query(
        'versioned-behandeling',
        publicationFilter,
      );
      const agendas = await this.store.query('agenda', {
        filter: {
          'agenda-status': 'gepubliceerd',
          zitting: {
            id: this.zitting.id,
          },
        },
      });
      const publishedResourcesCount =
        agendas.length +
        versionedBehandelingen.length +
        versionedBesluitenLijsten.length +
        versionedNotulen.length;
      return publishedResourcesCount === 0;
    } catch (err) {
      console.error('Error while checking if meeting can be deleted', err);
      return true;
    }
  });

  isSigned = trackedFunction(this, async () => {
    // This is needed here, see https://github.com/NullVoxPopuli/ember-resources/issues/340
    await Promise.resolve();

    const signedResources = await this.store.query('signed-resource', {
      'filter[versioned-notulen][zitting][:id:]': this.zitting.id,
      'filter[:or:][deleted]': false,
      'filter[:or:][:has-no:deleted]': 'yes',
    });

    const arraySignedResources = signedResources.slice();

    return !!arraySignedResources.length;
  });

  get status() {
    if (this.isPublished.value) {
      return this.intl.t('meeting-form.notulen-published');
    } else if (this.isSigned.value) {
      return this.intl.t('meeting-form.notulen-signed');
    } else {
      return null;
    }
  }

  get readOnly() {
    return Boolean(
      (!this.currentSession.canWrite && this.currentSession.canRead) ||
        this.isSigned.value ||
        this.isPublished.value,
    );
  }

  get zitting() {
    return this.args.zitting;
  }

  get isInaugurationMeeting() {
    return this.zitting instanceof InstallatieVergaderingModel;
  }

  synchronizationStatus = trackedFunction(this, async () => {
    const meeting = this.zitting;
    if (!(meeting instanceof InstallatieVergaderingModel)) {
      return;
    }
    const synchronizationStatus = (await meeting.synchronizationStatus) as
      | InstallatieVergaderingSynchronizationStatusModel
      | undefined;
    return synchronizationStatus;
  });

  get isLoading() {
    return this.fetchTreatments.isRunning;
  }
  get isComplete() {
    return !this.zitting?.isNew && this.behandelingen?.length > 0;
  }
  get bestuursorgaan() {
    return this.meetingDetailsData.value?.bestuursorgaan ?? null;
  }
  get headerArticleTranslationString() {
    return (
      this.meetingDetailsData.value?.headerArticleTranslationString ??
      'meeting-form.meeting-heading-article-ungendered'
    );
  }
  get secretaris() {
    return this.meetingDetailsData.value?.secretaris;
  }
  get voorzitter() {
    return this.meetingDetailsData.value?.voorzitter;
  }

  aanwezigenBijStartQuery = trackedFunction(this, async () => {
    const participants = await this.zitting.aanwezigenBijStart;
    const participantsWithNames = await Promise.all(
      participants.map(async (mandatee) => {
        const surname =
          unwrap(await mandatee.isBestuurlijkeAliasVan).achternaam ?? '';

        return { mandatee, surname };
      }),
    );
    return participantsWithNames
      .sort((a, b) => (a.surname < b.surname ? 1 : -1))
      .map((a) => a.mandatee);
  });

  afwezigenBijStartQuery = trackedFunction(this, async () => {
    const absentees = await this.zitting.afwezigenBijStart;

    const absenteesWithNames = await Promise.all(
      absentees.map(async (mandatee) => {
        const surname =
          unwrap(await mandatee.isBestuurlijkeAliasVan).achternaam ?? '';
        return { mandatee, surname };
      }),
    );
    return absenteesWithNames
      .sort((a, b) => (a.surname < b.surname ? 1 : -1))
      .map((a) => a.mandatee);
  });

  nietToegekendeMandatarissenQuery = trackedFunction(this, async () => {
    const unassignedMandatees = await this.zitting.nietToegekendeMandatarissen;
    const unassignedWithNames = await Promise.all(
      unassignedMandatees.map(async (mandatee) => {
        const surname =
          unwrap(await mandatee.isBestuurlijkeAliasVan).achternaam ?? '';
        return { mandatee, surname };
      }),
    );
    return unassignedWithNames
      .sort((a, b) => (a.surname < b.surname ? 1 : -1))
      .map((a) => a.mandatee);
  });

  meetingDetailsTask = restartableTask(async () => {
    const bestuursorgaan = await this.zitting.bestuursorgaan;
    // Can only be null in odd cases, such as while the zitting is being deleted
    if (!bestuursorgaan) {
      return;
    }
    const generalBestuursorgaan = await bestuursorgaan.isTijdsspecialisatieVan;
    if (!generalBestuursorgaan) {
      return;
    }
    const classification = unwrap(await generalBestuursorgaan.classificatie);
    const headerArticleTranslationString =
      articlesBasedOnClassifcationMap[
        classification.uri as keyof typeof articlesBasedOnClassifcationMap
      ];
    const secretaris = await this.zitting.secretaris;
    const voorzitter = await this.zitting.voorzitter;
    return {
      bestuursorgaan,
      headerArticleTranslationString,
      secretaris,
      voorzitter,
    };
  });

  meetingDetailsData = trackedTask<
    | {
        bestuursorgaan: BestuursorgaanModel;
        headerArticleTranslationString: string;
        secretaris: FunctionarisModel | null | undefined;
        voorzitter: MandatarisModel | null | undefined;
      }
    | undefined
  >(this, this.meetingDetailsTask, () => [
    this.zitting.secretaris,
    this.zitting.voorzitter,
    this.zitting.bestuursorgaan,
  ]);

  fetchPossibleParticipants = restartableTask(async () => {
    const bestuursorgaanIT = this.bestuursorgaan;
    if (!bestuursorgaanIT) {
      return [];
    }
    const aanwezigenRoles = await this.store.query<BestuursfunctieCodeModel>(
      'bestuursfunctie-code',
      {
        'filter[standaard-type-van][is-classificatie-van][heeft-tijdsspecialisaties][:id:]':
          bestuursorgaanIT.id,
      },
    );
    const stringifiedDefaultTypeIds = aanwezigenRoles
      .map((t) => t.id)
      .join(',');
    const startOfMeeting = unwrap(
      this.zitting.gestartOpTijdstip ?? this.zitting.geplandeStart,
    );
    const queryParams = {
      include: [
        'is-bestuurlijke-alias-van',
        'is-bestuurlijke-alias-van.geboorte',
        'status',
        'bekleedt',
        'bekleedt.bestuursfunctie',
      ].join(','),
      sort: 'is-bestuurlijke-alias-van.achternaam',
      filter: {
        bekleedt: {
          'bevat-in': {
            ':uri:': bestuursorgaanIT.uri,
          },
          bestuursfunctie: {
            ':id:': stringifiedDefaultTypeIds,
          },
        },
        status: {
          ':id:': [
            MANDATARIS_STATUS_EFFECTIEF,
            MANDATARIS_STATUS_WAARNEMEND,
          ].join(','),
        },
        ':lte:start': startOfMeeting.toISOString(),
        ':or:': {
          ':has-no:einde': true,
          ':gt:einde': startOfMeeting.toISOString(),
        },
        ':has:is-bestuurlijke-alias-van': true,
      },
      page: { size: 100 }, //arbitrary number, later we will make sure there is previous last. (also like this in the plugin)
    };
    const mandatees = [
      ...(await this.store.query<MandatarisModel>(
        'mandataris',
        queryParams as unknown as LegacyResourceQuery<MandatarisModel>,
      )),
    ];
    return mandatees;
  });

  possibleParticipantsData = trackedTask<MandatarisModel[]>(
    this,
    this.fetchPossibleParticipants,
    () => [this.zitting.geplandeStart, this.zitting.gestartOpTijdstip],
  );
  get possibleParticipants() {
    return this.possibleParticipantsData.value ?? [];
  }

  fetchTreatments = task(async () => {
    this.behandelingen.splice(0, this.behandelingen.length);
    if (!this.zitting.id) {
      return null;
    }
    const pageSize = 20;
    const firstPage = await this.store.query<BehandelingVanAgendapunt>(
      'behandeling-van-agendapunt',
      {
        include: [
          'document-container.status',
          'document-container.current-version',
          'voorzitter',
          'secretaris',
          'onderwerp',
          'stemmingen',
          'aanwezigen.is-bestuurlijke-alias-van',
          'afwezigen.is-bestuurlijke-alias-van',
        ].join(','),
        'filter[onderwerp][zitting][:id:]': this.args.zitting.id,
        'page[size]': pageSize,
        sort: 'onderwerp.position',
      } as unknown as LegacyResourceQuery<BehandelingVanAgendapunt>,
    );
    const count = unwrap(firstPage.meta)['count'] as number;
    firstPage.forEach((result) => this.behandelingen.push(result));
    let pageNumber = 1;
    const queries = [];
    while (pageNumber * pageSize < count) {
      queries.push(
        this.store
          .query<BehandelingVanAgendapunt>('behandeling-van-agendapunt', {
            'filter[onderwerp][zitting][:id:]': this.args.zitting.id,
            'page[size]': pageSize,
            'page[number]': pageNumber,
            include: [
              'document-container.status',
              'document-container.current-version',
              'voorzitter',
              'secretaris',
              'onderwerp',
              'stemmingen',
              'aanwezigen.is-bestuurlijke-alias-van',
              'afwezigen.is-bestuurlijke-alias-van',
            ].join(','),
            sort: 'onderwerp.position',
          } as unknown as LegacyResourceQuery<BehandelingVanAgendapunt>)
          .then((results) => ({ pageNumber, results })),
      );

      pageNumber++;
    }
    const resultSets = await all(queries);
    resultSets
      .sort((a, b) => a.pageNumber - b.pageNumber)
      .forEach(({ results }) =>
        results.forEach((result) => this.behandelingen.push(result)),
      );
  });

  @action
  async saveParticipationList({
    chairman,
    secretary,
    attendees,
    absentees,
    unassignedMandatees,
  }: ParticipationInfo) {
    this.zitting.set('voorzitter', chairman);
    this.zitting.set('secretaris', secretary);
    this.zitting.set('aanwezigenBijStart', attendees);
    this.zitting.set('afwezigenBijStart', absentees);
    this.zitting.set('nietToegekendeMandatarissen', unassignedMandatees);
    await this.zitting.save();
    await this.validation.retry();
  }

  @action
  async onAgendaSave() {
    await this.fetchTreatments.perform();
    await this.validation.retry();
  }

  @action
  goToPublish() {
    this.router.transitionTo('meetings.publish.agenda', this.args.zitting.id);
  }

  get meetingDateForTitle() {
    if (this.zitting?.gestartOpTijdstip) {
      return this.zitting.gestartOpTijdstip;
    } else return unwrap(this.zitting.geplandeStart);
  }
  @action
  toggleFocusMode() {
    const newFocus = !this.args.focused;
    this.router.transitionTo({ queryParams: { focused: newFocus } });
  }
  @action
  toggleShowDeleteModal() {
    this.showDeleteModal = !this.showDeleteModal;
  }

  <template>
    <div class='au-c-app-chrome' {{didInsert this.fetchTreatments.perform}}>
      <AuToolbar @size='small' class='au-u-padding-bottom-none' as |Group|>
        <Group>
          <AuLink
            @route='inbox.meetings'
            @skin='secondary'
            @icon='arrow-left'
            @iconAlignment='left'
          >
            {{t 'meeting-form.back-button'}}
          </AuLink>
          <span class='au-c-app-chrome__entity'>
            {{! @glint-expect-error we should load this correctly }}
            {{this.currentSession.group.classificatie.label}}
            {{this.currentSession.group.naam}}
          </span>
        </Group>
        <Group>
          <ul class='au-c-list-horizontal au-u-padding-right-tiny'>
            <li class='au-c-list-horizontal__item'>
              {{!
          <span class="au-c-app-chrome__status">
            <AuIcon @icon="alert-triangle" @alignment="left" />
            Wijzigingen niet bewaard
          </span>
          }}
            </li>
          </ul>
        </Group>
      </AuToolbar>
      <AuToolbar @size='small' class='au-u-padding-top-none' as |Group|>
        <Group class='au-u-flex--vertical-center'>
          <h1 class='au-c-app-chrome__title'>
            {{#if this.isInaugurationMeeting}}
              {{t 'meeting-form.scheduled-text.inauguration-meeting'}}
            {{else}}
              {{t 'meeting-form.scheduled-text.common-meeting'}}
            {{/if}}
            {{plainDate @zitting.geplandeStart}}</h1>
          {{#if this.synchronizationStatus.value}}
            <AuPill>

              {{t
                'inauguration-meeting.last-synchronization'
                date=(detailedDate this.synchronizationStatus.value.timestamp)
              }}
            </AuPill>
          {{/if}}
          {{#if this.status}}
            <AuPill @skin='success'>
              {{this.status}}
            </AuPill>
          {{/if}}
        </Group>
        <Group class='au-u-flex--vertical-center'>
          <AuToggleSwitch
            @checked={{@focused}}
            @onChange={{this.toggleFocusMode}}
            class='has-tooltip'
          >
            {{t 'meeting-form.focus-mode'}}
            <WithTooltip @tooltip={{t 'meeting-form.focus-mode-tooltip'}}>
              <AuIcon @icon='info-circle' />
            </WithTooltip>

          </AuToggleSwitch>
          {{#unless this.readOnly}}
            {{#if this.isInaugurationMeeting}}
              <InaugurationMeetingSynchronization @meeting={{this.zitting}} />
            {{/if}}
          {{/unless}}
          <AuDropdown
            @skin='secondary'
            @title={{t 'meeting-form.actions.dropdown-title'}}
            @alignment='left'
            @icon='chevron-down'
            role='menu'
          >
            {{#if @focused}}
              {{#if this.isComplete}}
                <AuButton
                  @skin='link'
                  role='menuitem'
                  @icon='sign'
                  {{on 'click' this.goToPublish}}
                >
                  {{t 'meeting-form.publish-button'}}
                </AuButton>
              {{/if}}
            {{else}}
              <AuLink
                @skin='primary'
                @route='meetings.download'
                @icon='copy-paste'
                @model={{@zitting}}
                role='menuitem'
              >
                {{t 'meeting-form.actions.download-treatments'}}
              </AuLink>
            {{/if}}
            {{#if (and this.canBeDeleted.value (not this.readOnly))}}
              <AuButton
                {{on 'click' this.toggleShowDeleteModal}}
                @skin='link'
                @alert={{true}}
                role='menuitem'
              >
                <AuIcon @icon='bin' @alignment='left' />
                {{t 'meetings.delete.delete'}}
              </AuButton>
            {{/if}}
          </AuDropdown>
          {{#if @focused}}
            <AuLink
              @skin='button-secondary'
              @route='meetings.download'
              @model={{@zitting}}
            >
              {{t 'meeting-form.actions.download-treatments'}}
            </AuLink>
          {{else}}
            {{#if (or this.isComplete this.isLoading)}}
              <AuButton
                @skin='secondary'
                @loading={{this.isLoading}}
                @loadingMessage={{t 'application.loading'}}
                {{on 'click' this.goToPublish}}
              >
                {{t 'meeting-form.publish-button'}}
              </AuButton>
            {{else}}
              <span>
                <AuIcon @icon='info-circle' />
                {{t 'meeting-form.incomplete-warning'}}
              </span>
            {{/if}}
          {{/if}}
        </Group>
      </AuToolbar>
    </div>

    <div
      id='content'
      class='au-c-body-container au-c-body-container--scroll au-c-meeting'
    >
      <div class='au-c-meeting__sidebar-left au-u-hide-on-print'>
        <MeetingNavigationCard
          @error={{this.validation.isRejected}}
          @loading={{this.validation.isPending}}
          @validationResult={{this.validation.value}}
        />
      </div>
      <div class='au-c-meeting-chrome'>
        <div class='au-c-meeting-chrome__paper'>
          {{! Meeting title }}
          <AuHeading>
            {{t 'meeting-form.meeting-heading-part-one'}}
            {{t this.headerArticleTranslationString}}
            {{#if this.isInaugurationMeeting}}
              {{t 'meeting-form.inauguration-meeting'}}
            {{/if}}
            <span class='au-c-meeting-chrome__highlight'>
              {{! @glint-expect-error we should load this correctly }}
              {{@zitting.bestuursorgaan.isTijdsspecialisatieVan.naam}},
            </span>
            {{t 'meeting-form.meeting-heading-part-two'}}
            <span class='au-c-meeting-chrome__highlight'>{{detailedDate
                this.meetingDateForTitle
              }}</span>
          </AuHeading>
          <AuHr @size='large' />

          {{! General Information }}
          <MeetingSection
            @title={{t 'meeting-form.first-section-title'}}
            @helpText={{t 'meeting-form.first-section-not-filled-warning'}}
            id='sectionOne'
          >
            <ManageZittingsdata
              @zitting={{@zitting}}
              @readOnly={{this.readOnly}}
            />
            {{#unless @focused}}
              <ManageIntermissions
                @zitting={{@zitting}}
                @readOnly={{this.readOnly}}
              />
            {{/unless}}
          </MeetingSection>

          {{#if this.bestuursorgaan}}

            {{#if
              (or
                this.aanwezigenBijStartQuery.isPending
                this.afwezigenBijStartQuery.isPending
                this.nietToegekendeMandatarissenQuery.isPending
              )
            }}
              <AuLoader>{{t 'participation-list.loading-title'}}</AuLoader>
            {{else}}
              {{#unless @focused}}
                {{! Participation list }}
                <MeetingSection
                  @title={{t 'meeting-form.second-section-title'}}
                  @helpText={{t
                    'meeting-form.second-section-not-filled-warning'
                  }}
                  id='sectionTwo'
                >
                  <ParticipationList
                    @attendanceValidationResult={{this.validation.value.attendance}}
                    @chairman={{this.voorzitter}}
                    @secretary={{this.secretaris}}
                    @participants={{this.aanwezigenBijStartQuery.value}}
                    @defaultParticipants={{this.possibleParticipants}}
                    @absentees={{this.afwezigenBijStartQuery.value}}
                    @unassignedMandatees={{this.nietToegekendeMandatarissenQuery.value}}
                    @possibleParticipants={{this.possibleParticipants}}
                    @bestuursorgaan={{this.bestuursorgaan}}
                    @onSave={{this.saveParticipationList}}
                    @meeting={{this.zitting}}
                    @modalTitle={{t 'generic.edit'}}
                    @readOnly={{this.readOnly}}
                    @loading={{this.possibleParticipantsData.isRunning}}
                  />
                </MeetingSection>
              {{/unless}}
              {{! Agenda }}
              <MeetingSection
                @title={{t 'meeting-form.third-section-title'}}
                @helpText={{t 'meeting-form.third-section-not-filled-warning'}}
                id='sectionThree'
              >
                <AgendaManager
                  {{! @glint-expect-error we should handle this }}
                  @zittingId={{@zitting.id}}
                  @onSave={{this.onAgendaSave}}
                  @readOnly={{this.readOnly}}
                />
              </MeetingSection>
              {{#unless @focused}}
                {{! Start of meeting }}
                <MeetingSection
                  @title={{t 'meeting-form.fourth-section-title'}}
                  @helpText={{t 'manage-free-text.before'}}
                  id='sectionFour'
                >
                  <MeetingSubSection
                    @title={{t 'behandeling-van-agendapunten.content-title'}}
                  >
                    <:body>
                      <ReadonlyTextBox>
                        {{htmlSafe @zitting.intro}}
                      </ReadonlyTextBox>
                    </:body>
                    <:button>
                      {{#unless this.readOnly}}
                        <AuLink
                          @route='meetings.edit.intro'
                          @model={{@zitting.id}}
                          @skin='button-secondary'
                          @icon='pencil'
                          @iconAlignment='left'
                          class='au-u-hide-on-print'
                        >
                          {{t 'generic.edit'}}
                        </AuLink>
                      {{/unless}}
                    </:button>
                  </MeetingSubSection>
                </MeetingSection>
              {{/unless}}

              {{! Treatment of agenda }}
              <MeetingSection
                @title={{t 'meeting-form.fifth-section-title'}}
                @helpText={{t 'meeting-form.fifth-section-not-filled-warning'}}
                id='sectionFive'
              >
                {{#if this.fetchTreatments.isRunning}}
                  <AuLoader>{{t 'participation-list.loading-loader'}}</AuLoader>
                {{else}}
                  <ol class='au-c-meeting-numbered-list'>
                    {{#each this.behandelingen as |behandeling|}}
                      <li>
                        <BehandelingVanAgendapuntComponent
                          @validationResult={{if
                            this.validation.value
                            (get
                              this.validation.value.treatments
                              (unwrap behandeling.id)
                            )
                          }}
                          @possibleParticipants={{this.possibleParticipants}}
                          @behandeling={{behandeling}}
                          @readOnly={{this.readOnly}}
                          @bestuursorgaan={{this.bestuursorgaan}}
                          @meeting={{this.zitting}}
                          @focusMode={{@focused}}
                          @loadingParticipants={{this.possibleParticipantsData.isRunning}}
                          @onAttendanceSave={{this.validation.retry}}
                        />
                      </li>
                    {{/each}}
                  </ol>
                {{/if}}
              </MeetingSection>
            {{/if}}
            {{#unless @focused}}
              {{! End of meeting }}
              <MeetingSection
                @title={{t 'meeting-form.sixth-section-title'}}
                @helpText={{t 'manage-free-text.after'}}
                id='sectionSix'
              >
                <MeetingSubSection
                  @title={{t 'behandeling-van-agendapunten.content-title'}}
                >
                  <:body>
                    <ReadonlyTextBox>
                      {{htmlSafe @zitting.outro}}
                    </ReadonlyTextBox>
                  </:body>
                  <:button>
                    {{#unless this.readOnly}}
                      <AuLink
                        @route='meetings.edit.outro'
                        @model={{@zitting.id}}
                        @skin='button-secondary'
                        @icon='pencil'
                        @iconAlignment='left'
                        class='au-u-hide-on-print'
                      >
                        {{t 'generic.edit'}}
                      </AuLink>
                    {{/unless}}
                  </:button>
                </MeetingSubSection>
              </MeetingSection>
            {{/unless}}
          {{else}}
            <AuHelpText @size='large' @skin='secondary'>
              {{t 'meeting-form.bestuursorgan-not-selected-warning'}}
            </AuHelpText>
          {{/if}}
        </div>
      </div>
    </div>
    <DeleteMeetingModal
      @show={{this.showDeleteModal}}
      @closeModal={{this.toggleShowDeleteModal}}
      @meeting={{@zitting}}
    />
  </template>
}

type MeetingNavigationCardSignature = {
  Args: {
    loading: boolean;
    error: boolean;
    validationResult?: MeetingValidationResult | null;
  };
};

class MeetingNavigationCard extends Component<MeetingNavigationCardSignature> {
  @service declare store: Store;
  @service declare userPreferences: UserPreferencesService;
  @localCopy('expandedQuery.value') expanded?: boolean = true;

  expandedQuery = trackedFunction(this, async () => {
    try {
      const expanded = await this.userPreferences.load(
        'meeting.sidebar.navigation.expanded',
      );
      return expanded;
    } catch (e) {
      console.error(e);
      return false;
    }
  });

  treatments = trackedFunction(this, async () => {
    const { validationResult } = this.args;
    if (!validationResult) {
      return [];
    }
    const treatmentValidationResults = validationResult.treatments;
    return Promise.all(
      Object.entries(treatmentValidationResults).map(
        async ([id, validationResult]) => {
          return {
            value: await this.store.findRecord<BehandelingVanAgendapunt>(
              'behandeling-van-agendapunt',
              id,
              {
                reload: true,
                include: 'onderwerp',
              } as unknown as LegacyResourceQuery<BehandelingVanAgendapunt>,
            ),
            ok: validationResult.ok,
          };
        },
      ),
    );
  });

  get treatmentsOk() {
    const { validationResult } = this.args;
    if (!validationResult) {
      return true;
    }
    const treatmentValidationResults = validationResult.treatments;
    return Object.values(treatmentValidationResults).every(
      (validationResult) => validationResult.ok,
    );
  }

  @action
  async onCardToggle() {
    this.expanded = !this.expanded;
    await this.userPreferences.save(
      'meeting.sidebar.navigation.expanded',
      this.expanded,
    );
  }

  <template>
    <AuCard
      class='meeting-validation-card'
      @expandable={{true}}
      @isExpanded={{this.expanded}}
      @openSection={{this.onCardToggle}}
      @manualControl={{true}}
      @size='small'
      as |C|
    >
      <C.header>
        <AuHeading @level='3' @skin='5'>
          {{t 'meeting-toc-card.title'}}
        </AuHeading>
      </C.header>
      <C.content>
        {{#if @loading}}
          <AuLoader @inline={{true}} @hideMessage={{false}} @centered={{false}}>
            {{t 'application.loading'}}
          </AuLoader>
        {{else if @error}}
          <AuAlert @skin='error' @icon='cross' @size='small'>
            <p>{{t 'meeting-toc-card.error'}}</p>
            <p>{{htmlSafe
                (t
                  'generic.error-contact-us'
                  email='gelinktnotuleren@vlaanderen.be'
                )
              }}</p>
          </AuAlert>
        {{else if @validationResult}}
          <AuList @divider={{true}} as |Item|>
            <Item>
              <NavigationEntry
                @href='#sectionOne'
                @ok={{@validationResult.general.ok}}
                @successMessage={{t
                  'meeting-toc-card.sections.general.validation.success'
                }}
                @warningMessage={{t
                  'meeting-toc-card.sections.general.validation.warning'
                }}
              >
                {{t 'meeting-toc-card.sections.general.label'}}
              </NavigationEntry>

            </Item>
            <Item>
              <NavigationEntry
                @href='#sectionTwo'
                @ok={{@validationResult.attendance.ok}}
                @successMessage={{t
                  'meeting-toc-card.sections.attendance.validation.success'
                }}
                @warningMessage={{t
                  'meeting-toc-card.sections.attendance.validation.warning'
                }}
              >
                {{t 'meeting-toc-card.sections.attendance.label'}}
              </NavigationEntry>
            </Item>
            <Item>
              <NavigationEntry
                @href='#sectionThree'
                @ok={{true}}
                @successMessage={{t
                  'meeting-toc-card.sections.agenda.validation.success'
                }}
                @warningMessage={{t
                  'meeting-toc-card.sections.agenda.validation.warning'
                }}
              >
                {{t 'meeting-toc-card.sections.agenda.label'}}
              </NavigationEntry>
            </Item>
            <Item>
              <NavigationEntry
                @href='#sectionFour'
                @ok={{true}}
                @successMessage={{t
                  'meeting-toc-card.sections.intro.validation.success'
                }}
                @warningMessage={{t
                  'meeting-toc-card.sections.intro.validation.warning'
                }}
              >
                {{t 'meeting-toc-card.sections.intro.label'}}
              </NavigationEntry>
            </Item>
            <Item>
              <NavigationEntry
                @href='#sectionFive'
                @ok={{this.treatmentsOk}}
                @successMessage={{t
                  'meeting-toc-card.sections.treatments.validation.success'
                }}
                @warningMessage={{t
                  'meeting-toc-card.sections.treatments.validation.warning'
                }}
              >
                {{t 'meeting-toc-card.sections.treatments.label'}}
              </NavigationEntry>

              <AuList class='au-u-margin-top-small' as |Item|>
                {{#each this.treatments.value as |treatment|}}
                  <Item>
                    <NavigationEntry
                      @href={{concat '#behandeling-' treatment.value.id}}
                      @ok={{treatment.ok}}
                      @successMessage={{t
                        'meeting-toc-card.sections.treatment.validation.success'
                      }}
                      @warningMessage={{t
                        'meeting-toc-card.sections.treatment.validation.warning'
                      }}
                    >
                      {{! @glint-expect-error properly await this }}
                      {{add treatment.value.onderwerp.position 1}}.
                      {{! @glint-expect-error properly await this }}
                      {{treatment.value.onderwerp.titel}}
                    </NavigationEntry>
                  </Item>
                {{/each}}
              </AuList>
            </Item>
            <Item>
              <NavigationEntry
                @href='#sectionSix'
                @ok={{true}}
                @successMessage={{t
                  'meeting-toc-card.sections.outro.validation.success'
                }}
                @warningMessage={{t
                  'meeting-toc-card.sections.outro.validation.warning'
                }}
              >
                {{t 'meeting-toc-card.sections.outro.label'}}
              </NavigationEntry>
            </Item>
          </AuList>
        {{/if}}
      </C.content>
    </AuCard>
  </template>
}

type NavigationEntrySignature = {
  Args: {
    href: string;
    ok: boolean;
    successMessage: string;
    warningMessage: string;
  };
  Blocks: {
    default: [];
  };
};

const NavigationEntry: TOC<NavigationEntrySignature> = <template>
  <AuLinkExternal
    class='au-u-flex au-u-flex--row au-u-flex--between'
    href={{@href}}
    @skin='secondary'
    @newTab={{false}}
  >
    <span>
      {{yield}}
    </span>
    {{#unless @ok}}
      <WithTooltip
        @tooltip={{if @ok @successMessage @warningMessage}}
        @placement='bottom-start'
      >
        <AuBadge
          class='meeting-validation-card__icon au-u-margin-tiny'
          @skin='warning'
          @icon='alert-triangle'
        />
      </WithTooltip>
    {{/unless}}

  </AuLinkExternal>
</template>;
