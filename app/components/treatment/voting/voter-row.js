import Component from '@glimmer/component';
import { action } from '@ember/object';
/**
 * @typedef {import("../../../models/mandataris").default} Mandataris
 */

/** @typedef {import("ember-concurrency").Task} Task */
/**
 * @typedef {Object} Args
 * @property {(boolean) => void} onIsVotingChange
 * @property {[Mandataris, string]} row Mandataris and isBestuurlijkeAliasVan should be fully resolved
 */

/** @extends {Component<Args>}
 * Ex
 * */
export default class TreatmentVotingVoterRowComponent extends Component {
  voteOptions = ['voor', 'tegen', 'onthouding'];

  constructor(parent, args) {
    super(parent, args);
  }
  get persoon() {
    return this.args.row[0].isBestuurlijkeAliasVan;
  }
  get isVoting() {
    return this.args.row[1] !== 'zalNietStemmen';
  }
  get mandataris() {
    return this.args.row[0];
  }
  get selectedVote() {
    if (this.args.row[1] === 'zalStemmen') {
      return 'selecteer';
    }
    return this.args.row[1];
  }
  get showVoteSelect() {
    return this.isVoting && !this.args.secret;
  }

  @action
  addStemmer() {
    this.args.onVoteChange(this.args.row[0], 'zalStemmen');
  }
  @action
  removeStemmer() {
    this.args.onVoteChange(this.args.row[0], 'zalNietStemmen');
  }

  @action
  /**
   * @param {Event} event
   */
  onSelectVote(event) {
    const vote = event.target.value;
    this.args.onVoteChange(this.args.row[0], vote);
  }
}
