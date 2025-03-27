import Model, {
  attr,
  belongsTo,
  hasMany,
  type AsyncBelongsTo,
  type AsyncHasMany,
} from '@ember-data/model';
import { DRAFT_FOLDER_ID, SCHEDULED_STATUS_ID } from '../utils/constants';
import { service } from '@ember/service';
import { trackedFunction } from 'reactiveweb/function';
import type Store from 'frontend-gelinkt-notuleren/services/store';
import type Agendapunt from './agendapunt';
import type FunctionarisModel from './functionaris';
import type MandatarisModel from './mandataris';
import type DocumentContainerModel from './document-container';
import type VersionedBehandelingModel from './versioned-behandeling';
import type BesluitModel from './besluit';
import type StemmingModel from './stemming';
import { unwrap } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/option';
import type { Type } from '@warp-drive/core-types/symbols';
import EditorDocumentFolderModel from './editor-document-folder';
import ConceptModel from './concept';
import EditorDocumentModel from './editor-document';

export default class BehandelingVanAgendapunt extends Model {
  declare [Type]: 'behandeling-van-agendapunt';

  @service declare store: Store;

  @attr openbaar?: boolean;
  @attr afgeleidUit?: string;
  @attr('string') gevolg?: string;

  @belongsTo('behandeling-van-agendapunt', { inverse: null, async: true })
  declare vorigeBehandelingVanAgendapunt: AsyncBelongsTo<BehandelingVanAgendapunt>;
  @belongsTo('agendapunt', { inverse: 'behandeling', async: true })
  declare onderwerp: AsyncBelongsTo<Agendapunt>;

  // @ts-expect-error add types for `defaultPageSize`
  @belongsTo('functionaris', {
    inverse: null,
    defaultPageSize: 100,
    async: true,
  })
  declare secretaris: AsyncBelongsTo<FunctionarisModel>;

  // original queries fetching these used pagesize of 100
  // @ts-expect-error add types for `defaultPageSize`
  @belongsTo('mandataris', { inverse: null, defaultPageSize: 100, async: true })
  declare voorzitter: AsyncBelongsTo<MandatarisModel>;

  @belongsTo('document-container', { inverse: null, async: true })
  declare documentContainer: AsyncBelongsTo<DocumentContainerModel>;

  @hasMany('versioned-behandeling', { inverse: 'behandeling', async: true })
  declare versionedBehandelingen: AsyncHasMany<VersionedBehandelingModel>;
  @hasMany('besluit', {
    inverse: 'volgendUitBehandelingVanAgendapunt',
    async: true,
  })
  declare besluiten: AsyncHasMany<BesluitModel>;

  // @ts-expect-error add types for `defaultPageSize`
  @hasMany('mandataris', { inverse: null, defaultPageSize: 100, async: true })
  declare aanwezigen: AsyncHasMany<MandatarisModel>;

  // @ts-expect-error add types for `defaultPageSize`
  @hasMany('mandataris', { inverse: null, defaultPageSize: 100, async: true })
  declare afwezigen: AsyncHasMany<MandatarisModel>;

  // original queries did "fetch all" pagination loops
  // @ts-expect-error add types for `defaultPageSize`
  @hasMany('stemming', {
    inverse: 'behandelingVanAgendapunt',
    defaultPageSize: 1000,
    async: true,
  })
  declare stemmingen: AsyncHasMany<StemmingModel>;

  // @ts-expect-error add types for `defaultPageSize`
  @hasMany('custom-voting', {
    inverse: 'behandelingVanAgendapunt',
    defaultPageSize: 1000,
    async: true,
  })
  declare customVotings: AsyncHasMany<StemmingModel>;

  sortedParticipantData = trackedFunction(this, async () => {
    const participants = await this.aanwezigen;
    const participantsWithNames = await Promise.all(
      participants.map(async (participant) => {
        const surname =
          unwrap(await participant.isBestuurlijkeAliasVan).achternaam ?? '';
        return { participant, surname };
      }),
    );
    return participantsWithNames
      .sort((a, b) => a.surname.localeCompare(b.surname))
      .map((pn) => pn.participant);
  });
  sortedAbsenteeData = trackedFunction(this, async () => {
    const absentees = await this.afwezigen;
    const absenteesWithNames = await Promise.all(
      absentees.map(async (absentee) => {
        const surname =
          unwrap(await absentee.isBestuurlijkeAliasVan).achternaam ?? '';
        return { absentee, surname };
      }),
    );
    return absenteesWithNames
      .sort((a, b) => a.surname.localeCompare(b.surname))
      .map((an) => an.absentee);
  });
  async getSortedVotings() {
    const normalVotings = this.stemmingen;
    const customVotings = this.customVotings;
    const votings = [...(await normalVotings), ...(await customVotings)];
    return votings
      ?.slice()
      .sort((a, b) => Number(a.position) - Number(b.position));
  }
  sortedVotingData = trackedFunction(this, async () => {
    return await this.getSortedVotings();
  });
  get sortedParticipants() {
    return this.sortedParticipantData.value;
  }
  get sortedAbsentees() {
    return this.sortedAbsenteeData.value;
  }
  get sortedVotings() {
    return this.sortedVotingData.value;
  }

  async initializeDocument(content?: string) {
    const agendaItem = unwrap(await this.onderwerp);
    const draftDecisionFolder =
      await this.store.findRecord<EditorDocumentFolderModel>(
        'editor-document-folder',
        DRAFT_FOLDER_ID,
      );
    const scheduledStatus = await this.store.findRecord<ConceptModel>(
      'concept',
      SCHEDULED_STATUS_ID,
    );

    const document = this.store.createRecord<EditorDocumentModel>(
      'editor-document',
      {
        title: agendaItem.titel,
        createdOn: new Date(),
        updatedOn: new Date(),
        content,
      },
    );

    const container = this.store.createRecord<DocumentContainerModel>(
      'document-container',
      {
        folder: draftDecisionFolder,
        status: scheduledStatus,
      },
    );
    container.set('currentVersion', document);

    // eslint-disable-next-line ember/classic-decorator-no-classic-methods
    this.set('documentContainer', container);
  }

  async saveAndPersistDocument() {
    const agendaItem = unwrap(await this.onderwerp);
    let container = await this.documentContainer;

    // New treatments will not have a documentContainer unless the user selected a draft
    if (!container) {
      await this.initializeDocument();
      container = unwrap(await this.documentContainer);
    }

    const document = unwrap(await container.currentVersion);
    document.title = agendaItem.titel ?? '';

    await document.save();
    await container.save();
    await this.save();
  }
}
