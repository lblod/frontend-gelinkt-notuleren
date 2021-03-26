import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
/**
 * @typedef {import("../../../models/mandataris").default} Mandataris
 * @typedef {import("../../../services/edit-stemming").default} EditStemmingService
 */

/**
 * @typedef {Object} Args
 */

/** @extends {Component<Args>} */
export default class TreatmentVotingVoterTableComponent extends Component {
  /** @type {EditStemmingService} */
  @service editStemming;
  get voters() {
    const map = this.editStemming.votingMap;
    const entries = [...map];
    return entries.sort((entry1, entry2) => {
      const lastName1 = entry1[0].get("isBestuurlijkeAliasVan.achternaam") || "";
      const lastName2 = entry2[0]?.get("isBestuurlijkeAliasVan.achternaam") || "";
      return lastName1.localeCompare(lastName2);
    });
  }
}
