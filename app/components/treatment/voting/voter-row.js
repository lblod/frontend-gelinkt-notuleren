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
 * @property {[Mandataris, string]} row
 */

/** @extends {Component<Args>} */
export default class TreatmentVotingVoterRowComponent extends Component {
  @tracked persoon;
  @tracked busy = false;
  voteOptions = ["voor", "tegen", "onthouding"];

  constructor(parent, args) {
    super(parent, args);
    this.fetchPersoon.perform();
  }
  get isVoting() {
    return this.args.row[1] !== "zalNietStemmen";
  }
  get bestuursFunctie() {
    return this.args.row[0].bekleedt.bestuursFunctie.label;

  }
  get selectedVote() {
    if (this.args.row[1] === "zalStemmen") {
      return "selecteer";
    }
    return this.args.row[1];
  }

  @task
  /** @type {Task<void, void>} */
  fetchPersoon = function* () {
    this.persoon = yield this.args.row[0].isBestuurlijkeAliasVan;

  };
  @action
  addStemmer() {
    this.busy = true;
    this.args.onVoteChange(this.args.row[0], "zalStemmen");
    this.busy = false;
  }
  @action
  removeStemmer() {
    this.busy = true;
    this.args.onVoteChange(this.args.row[0], "zalNietStemmen");
    this.busy = false;
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
