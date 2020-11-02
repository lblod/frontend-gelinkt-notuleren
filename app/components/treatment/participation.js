import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";
import Component from "@glimmer/component";
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

  constructor(owner, args) {
    super(owner, args);
    this.behandeling = this.args.behandeling;
  }

  @action
  toggleModal() {
    this.showParticipationModal = !this.showParticipationModal;
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
    this.behandeling.secretaris = participants.secretaris;
    this.behandeling.aanwezigen = participants.aanwezigenBijStart;
    await this.behandeling.save();
  }
}
