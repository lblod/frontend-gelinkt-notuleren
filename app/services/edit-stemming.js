import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';
import { action } from '@ember/object';
/** @typedef {import("../models/stemming").default} Stemming */

export default class EditStemmingService extends Service {
    /** @type {Stemming} */
    @tracked _stemming;

    /** @type {Map<string, string>} */
    @tracked
    votingMap = new Map();

    get stemming() {
        return this._stemming;
    }

    set stemming(stemming) {
        this._stemming = stemming;
        this.votingMap.clear();
        if (stemming !== null) {

            this.fetchVoters.perform();
        }
    }
    @task
    *saveTask() {
        const stemmers = [];
        const onthouders = [];
        const voorstanders = [];
        const tegenstanders = [];
        for (let [voter, vote] of this.votingMap) {
            if (vote === "onthouding") {
                onthouders.push(voter);

            } else {
                stemmers.push(voter);
                if (vote === "voor") {
                    voorstanders.push(voter);
                } else if (vote === "tegen") {
                    tegenstanders.push(voter);
                }

            }

        }
        this._stemming.stemmers.setObjects(stemmers);
        this._stemming.onthouders.setObjects(onthouders);
        this._stemming.voorstanders.setObjects(voorstanders);
        this._stemming.tegenstanders.setObjects(tegenstanders);
        yield this._stemming.save();
    }
    @task
    * fetchVoters() {
        const stemmers = yield this._stemming.stemmers;
        const onthouders = yield this._stemming.onthouders;
        const voorstanders = yield this._stemming.voorstanders;
        const tegenstanders = yield this._stemming.tegenstanders;
        stemmers.forEach(aanwezige =>
            this.votingMap.set(aanwezige, "zalStemmen"));
        onthouders.forEach(aanwezige =>
            this.votingMap.set(aanwezige, "onthouding"));
        voorstanders.forEach(aanwezige =>
            this.votingMap.set(aanwezige, "voor"));
        tegenstanders.forEach(aanwezige =>
            this.votingMap.set(aanwezige, "tegen"));
        this.refreshMap();

    }

    refreshMap() {
        // eslint-disable-next-line no-self-assign
        this.votingMap = this.votingMap;

    }

    save() {
        this.saveTask.perform();
    }

    @action
    setVote(voter, vote) {
        this.votingMap.set(voter, vote);
        this.refreshMap();
    }
    @action
    setUnaniemVoorstander() {
        for (let key of this.votingMap.keys()) {
            this.votingMap.set(key, "voor");
        }
        this.refreshMap();

    }
    @action
    setUnaniemTegenstander() {
        for (let key of this.votingMap.keys()) {
            this.votingMap.set(key, "tegen");
        }
        this.refreshMap();

    }
    @action
    setUnaniemOnthouder() {
        for (let key of this.votingMap.keys()) {
            this.votingMap.set(key, "onthouding");
        }
        this.refreshMap();

    }
}
