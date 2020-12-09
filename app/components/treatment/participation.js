import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";
import Component from "@glimmer/component";
import { task } from "ember-concurrency-decorators";

/**
 * @typedef {import("../../models/mandataris").default} Mandataris
 * @typedef {import("../../models/behandeling-van-agendapunt").default} Behandeling
 * @typedef {import("../../models/bestuursorgaan").default} BestuursOrgaan
 */

/**
 * @typedef {Object} Args
 * @property {Behandeling} behandeling
 * @property {BestuursOrgaan} bestuursorgaan
 */

/** @extends {Component<Args>} */
export default class TreatmentParticipationComponent extends Component {
  @tracked showParticipationModal = false;
  @tracked behandeling;
  @tracked aanwezigen;
  @tracked voorzitter;
  @tracked secretaris;

  constructor(owner, args) {
    super(owner, args);
    this.behandeling = this.args.behandeling;
    this.loadData.perform();
  }

  @action
  toggleModal() {
    this.showParticipationModal = !this.showParticipationModal;
  }

  @task
  *loadData() {
    this.aanwezigen = yield this.behandeling.aanwezigen;
    this.voorzitter = yield this.behandeling.voorzitter;
    this.secretaris = yield this.behandeling.secretaris;
  }

  get sortedAanwezigen() {
    return this.aanwezigen.sortBy('isBestuurlijkeAliasVan.achternaam');
  }

  /**
   * @typedef {Object} ParticipantInfo
   * @property {Mandataris} voorzitter
   * @property {Mandataris} secretaris
   * @property {Mandataris[]} aanwezigenBijStart
   */

  /**
   * @param {ParticipantInfo} participants
   */
  @action
  async saveParticipants(participants) {
    this.behandeling.voorzitter = participants.voorzitter;
    this.voorzitter = participants.voorzitter;
    this.behandeling.secretaris = participants.secretaris;
    this.secretaris = participants.secretaris;
    this.behandeling.aanwezigen = participants.aanwezigenBijStart;
    this.aanwezigen = participants.aanwezigenBijStart;
    await this.behandeling.save();
  }
}
