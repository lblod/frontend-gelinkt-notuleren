import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { DRAFT_FOLDER_ID, SCHEDULED_STATUS_ID } from '../utils/constants';
import { service } from '@ember/service';
import { trackedFunction } from 'ember-resources/util/function';

export default class BehandelingVanAgendapunt extends Model {
  @service store;

  @attr openbaar;
  @attr afgeleidUit;
  @attr('string') gevolg;

  @belongsTo('behandeling-van-agendapunt', { inverse: null })
  vorigeBehandelingVanAgendapunt;
  @belongsTo('agendapunt', { inverse: 'behandeling' }) onderwerp;
  // original queries fetching these used pagesize of 100
  @belongsTo('functionaris', { inverse: null, defaultPageSize: 100 })
  secretaris;
  // original queries fetching these used pagesize of 100
  @belongsTo('mandataris', { inverse: null, defaultPageSize: 100 }) voorzitter;
  @belongsTo('document-container', { inverse: null }) documentContainer;

  @hasMany('versioned-behandeling', { inverse: 'behandeling' })
  versionedBehandelingen;
  @hasMany('besluit', { inverse: 'volgendUitBehandelingVanAgendapunt' })
  besluiten;
  @hasMany('mandataris', { inverse: null }) aanwezigen;
  @hasMany('mandataris', { inverse: null }) afwezigen;
  // original queries did "fetch all" pagination loops
  @hasMany('stemming', {
    inverse: 'behandelingVanAgendapunt',
    defaultPageSize: 1000,
  })
  stemmingen;

  sortedParticipantData = trackedFunction(this, async () => {
    const participants = await this.aanwezigen;
    const participantsWithNames = await Promise.all(
      participants.map(async (participant) => {
        const surname = (await participant.isBestuurlijkeAliasVan).achternaam;
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
        const surname = (await absentee.isBestuurlijkeAliasVan).achternaam;
        return { absentee, surname };
      }),
    );
    return absenteesWithNames
      .sort((a, b) => a.surname.localeCompare(b.surname))
      .map((an) => an.absentee);
  });
  async getSortedVotings() {
    const votings = await this.stemmingen;
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
  async initializeDocument() {
    const agendaItem = await this.onderwerp;
    const draftDecisionFolder = await this.store.findRecord(
      'editor-document-folder',
      DRAFT_FOLDER_ID,
    );
    const scheduledStatus = await this.store.findRecord(
      'concept',
      SCHEDULED_STATUS_ID,
    );

    const document = this.store.createRecord('editor-document', {
      title: agendaItem.titel,
      createdOn: new Date(),
      updatedOn: new Date(),
    });

    const container = this.store.createRecord('document-container', {
      folder: draftDecisionFolder,
      status: scheduledStatus,
    });

    container.currentVersion = document;
    this.documentContainer = container;
  }

  async saveAndPersistDocument() {
    const agendaItem = await this.onderwerp;
    let container = await this.documentContainer;

    // New treatments will not have a documentContainer unless the user selected a draft
    if (!container) {
      await this.initializeDocument();
      container = await this.documentContainer;
    }

    const document = await container.currentVersion;
    document.title = agendaItem.titel;

    await document.save();
    await container.save();
    await this.save();
  }
}
