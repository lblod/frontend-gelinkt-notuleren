import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
/** @typedef {import("../../../models/stemming").default} Stemming */
/** @typedef {import("../../../models/mandataris").default} Mandataris */

/**
 * @typedef {Object} Args
 * @property {boolean} secret
 * @property {Stemming} stemming
 * @property {(Stemming) => void} onChangeVoters
 */

/**
 * @typedef {Object} Row
 * @property {boolean} isVoting
 * @property {Mandataris} mandataris
 */
/** @extends {Component<Args>} */
export default class TreatmentVotingManageVotersComponent extends Component {
    @service editStemming;

}
