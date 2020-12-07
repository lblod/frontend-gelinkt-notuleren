import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';
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
  voteOptions = ["voor", "tegen", "onthouding"];

  constructor(parent, args) {
    super(parent, args);
    // this.fetchPersoon.perform();
  }
  get persoon() {
    return this.args.row[0].isBestuurlijkeAliasVan;
  }
  get isVoting() {
    return this.args.row[1] !== "zalNietStemmen";
  }
  get mandataris() {
    return this.args.row[0];
  }
  get selectedVote() {
    if (this.args.row[1] === "zalStemmen") {
      return "selecteer";
    }
    return this.args.row[1];
  }

  // @task
  // /** @type {Task<void, void>} */
  // fetchPersoon = function* () {
  //   this.persoon = yield this.args.row[0].isBestuurlijkeAliasVan;

  // };
  @action
  addStemmer() {
    this.args.onVoteChange(this.args.row[0], "zalStemmen");
  }
  @action
  removeStemmer() {
    this.args.onVoteChange(this.args.row[0], "zalNietStemmen");
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
