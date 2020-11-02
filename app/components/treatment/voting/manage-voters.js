import Component from '@glimmer/component';
import { action } from '@ember/object';
import { task } from 'ember-concurrency-decorators';
import { tracked } from '@glimmer/tracking';
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
    @tracked manageVotes = false;
    backupMap;


    @action
    startManageVotes() {
        this.manageVotes = true;
        this.backupMap = new Map(this.editStemming.votingMap);
    }
    @action
    saveVotes() {
        this.manageVotes = false;
    }
    @action
    cancelVotes() {
        this.editStemming.votingMap = this.backupMap;
        this.manageVotes = false;
    }
}
