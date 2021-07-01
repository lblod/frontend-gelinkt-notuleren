import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import {DRAFT_FOLDER_ID, SCHEDULED_STATUS_ID} from "../utils/constants";

export default class BehandelingVanAgendapunt extends Model {
  @attr openbaar;
  @attr afgeleidUit;
  @attr('string') gevolg;
  @belongsTo('behandeling-van-agendapunt', { inverse: null }) vorigeBehandelingVanAgendapunt;
  @belongsTo('agendapunt', { inverse: 'behandeling' }) onderwerp;
  @belongsTo('functionaris', { inverse: null }) secretaris;
  @belongsTo('mandataris', { inverse: null }) voorzitter;
  @hasMany('besluit', { inverse: 'volgendUitBehandelingVanAgendapunt' }) besluiten;
  @hasMany('mandataris', { inverse: null }) aanwezigen;
  @hasMany('mandataris', { inverse: null }) afwezigen;
  @hasMany("stemming", {inverse: null}) stemmingen;
  @belongsTo('document-container') documentContainer;

  async initializeDocument() {
    const agendaItem = await this.onderwerp;
    const draftDecisionFolder = await  this.store.findRecord("editor-document-folder", DRAFT_FOLDER_ID);
    const scheduledStatus = await this.store.findRecord("concept", SCHEDULED_STATUS_ID);

    const document = this.store.createRecord("editor-document", {
      title: agendaItem.titel,
      createdOn: new Date(),
      updatedOn: new Date()
    });

    const container = this.store.createRecord("document-container", {
      folder: draftDecisionFolder,
      status: scheduledStatus
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
