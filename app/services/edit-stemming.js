import { inject as service } from "@ember/service";
import Service from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { task } from "ember-concurrency-decorators";
import { action } from "@ember/object";
/** @typedef {import("../models/stemming").default} Stemming */

export default class EditStemmingService extends Service {
  /** @type {Stemming} */
  @tracked _stemming;

  @service store;

  /** @type {Map<string, string>} */
  @tracked
  votingMap = new Map();

  get stemming() {
    return this._stemming;
  }

  set stemming(stemming) {
    this._stemming = stemming;
    this.votingMap.clear();
    this.refreshMap();
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
    if (!this._stemming.geheim) {
      this._stemming.voorstanders.setObjects(voorstanders);
      this._stemming.tegenstanders.setObjects(tegenstanders);
      this._stemming.aantalOnthouders = onthouders.length;
      this._stemming.aantalVoorstanders = voorstanders.length;
      this._stemming.aantalTegenstanders = tegenstanders.length;
    } else {
      this._stemming.voorstanders.clear();
      this._stemming.tegenstanders.clear();
    }
    yield this._stemming.save();
  }
  @task
  *fetchVoters() {
    const emptyStemmers =  yield this._stemming.stemmers;
    const emptyOnthouders = yield this._stemming.onthouders;
    const emptyVoorstanders = yield this._stemming.voorstanders;
    const emptyTegenstanders = yield this._stemming.tegenstanders;
    const stemmers = yield this.store.query("mandataris", {
      "filter[:id:]": emptyStemmers.map(s => s.id).join(","),
      include: "is-bestuurlijke-alias-van"
    });
    const onthouders = yield this.store.query("mandataris", {
      "filter[:id:]": emptyOnthouders.map(s => s.id).join(","),
      include: "is-bestuurlijke-alias-van"
    });
    const voorstanders = yield this.store.query("mandataris", {
      "filter[:id:]": emptyVoorstanders.map(s => s.id).join(","),
      include: "is-bestuurlijke-alias-van"
    });
    const tegenstanders = yield this.store.query("mandataris", {
      "filter[:id:]": emptyTegenstanders.map(s => s.id).join(","),
      include: "is-bestuurlijke-alias-van"
    });
    stemmers.forEach((aanwezige) =>
      this.votingMap.set(aanwezige, "zalStemmen")
    );
    onthouders.forEach((aanwezige) =>
      this.votingMap.set(aanwezige, "onthouding")
    );
    voorstanders.forEach((aanwezige) => this.votingMap.set(aanwezige, "voor"));
    tegenstanders.forEach((aanwezige) =>
      this.votingMap.set(aanwezige, "tegen")
    );
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
      if (this.votingMap.get(key) !== "zalNietStemmen") {
        this.votingMap.set(key, "voor");
      }
    }
    this.refreshMap();
  }
  @action
  setUnaniemTegenstander() {
    for (let key of this.votingMap.keys()) {
      if (this.votingMap.get(key) !== "zalNietStemmen") {
        this.votingMap.set(key, "tegen");
      }
    }
    this.refreshMap();
  }
  @action
  setUnaniemOnthouder() {
    for (let key of this.votingMap.keys()) {
      if (this.votingMap.get(key) !== "zalNietStemmen") {
        this.votingMap.set(key, "onthouding");
      }
    }
    this.refreshMap();
  }
}
