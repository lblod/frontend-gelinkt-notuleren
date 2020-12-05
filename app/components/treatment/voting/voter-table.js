import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
/**
 * @typedef {import("../../../models/mandataris").default} Mandataris
 */

/**
 * @typedef {Object} Args
 */

/** @extends {Component<Args>} */
export default class TreatmentVotingVoterTableComponent extends Component {
  @service editStemming;
}
