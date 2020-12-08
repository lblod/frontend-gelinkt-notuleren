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
    const map = this.editStemming.votingMap
    const entries = [...map];
    return entries.sort((entry1, entry2) =>
      entry1[0].isBestuurlijkeAliasVan
        .get("achternaam")
        .localeCompare(entry2[0].isBestuurlijkeAliasVan.get("achternaam"))
    );
  }
}
