import Service, { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { action } from '@ember/object';
/** @typedef {import("../models/stemming").default} Stemming */

export default class EditStemmingService extends Service {
  /** @type {Stemming | null} */
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

  saveTask = task(async () => {
    const stemmers = [];
    const onthouders = [];
    const voorstanders = [];
    const tegenstanders = [];
    for (let [voter, vote] of this.votingMap) {
      if (vote !== 'zalNietStemmen') {
        stemmers.push(voter);
        if (vote === 'voor') {
          voorstanders.push(voter);
        } else if (vote === 'tegen') {
          tegenstanders.push(voter);
        } else if (vote === 'onthouding') {
          onthouders.push(voter);
        }
      }
    }
    this._stemming.stemmers = stemmers;
    this._stemming.onthouders = onthouders;
    if (!this._stemming.geheim) {
      this._stemming.voorstanders = voorstanders;
      this._stemming.tegenstanders = tegenstanders;
      this._stemming.aantalOnthouders = onthouders.length;
      this._stemming.aantalVoorstanders = voorstanders.length;
      this._stemming.aantalTegenstanders = tegenstanders.length;
    } else {
      this._stemming.voorstanders = [];
      this._stemming.tegenstanders = [];
    }
    await this._stemming.save();
  });

  fetchVoters = task(async () => {
    if (this._stemming.isNew) {
      const aanwezigen = await Promise.all(
        (await this._stemming.aanwezigen).map(async (aanwezige) => {
          const queryResult = await this.store.query('mandataris', {
            'filter[:id:]': aanwezige.id,
            include: 'is-bestuurlijke-alias-van',
          });
          return queryResult[0];
        }),
      );
      aanwezigen.forEach((aanwezige) =>
        this.votingMap.set(aanwezige, 'zalStemmen'),
      );
    } else {
      const stemmingId = this._stemming.id;
      const stemming = (
        await this.store.query('stemming', {
          'filter[:id:]': stemmingId,
          include:
            'aanwezigen.is-bestuurlijke-alias-van,stemmers.is-bestuurlijke-alias-van,onthouders.is-bestuurlijke-alias-van,voorstanders.is-bestuurlijke-alias-van,tegenstanders.is-bestuurlijke-alias-van',
          page: { size: 100 },
        })
      )[0];

      const aanwezigen = stemming.aanwezigen;

      const stemmers = stemming.stemmers;

      const onthouders = stemming.onthouders;

      const voorstanders = stemming.voorstanders;

      const tegenstanders = stemming.tegenstanders;

      aanwezigen.forEach((aanwezige) =>
        this.votingMap.set(aanwezige, 'zalNietStemmen'),
      );
      stemmers.forEach((aanwezige) =>
        this.votingMap.set(aanwezige, 'zalStemmen'),
      );
      onthouders.forEach((aanwezige) =>
        this.votingMap.set(aanwezige, 'onthouding'),
      );
      voorstanders.forEach((aanwezige) =>
        this.votingMap.set(aanwezige, 'voor'),
      );
      tegenstanders.forEach((aanwezige) =>
        this.votingMap.set(aanwezige, 'tegen'),
      );
    }

    this.refreshMap();
  });

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
      if (this.votingMap.get(key) !== 'zalNietStemmen') {
        this.votingMap.set(key, 'voor');
      }
    }
    this.refreshMap();
  }
  @action
  setUnaniemTegenstander() {
    for (let key of this.votingMap.keys()) {
      if (this.votingMap.get(key) !== 'zalNietStemmen') {
        this.votingMap.set(key, 'tegen');
      }
    }
    this.refreshMap();
  }
  @action
  setUnaniemOnthouder() {
    for (let key of this.votingMap.keys()) {
      if (this.votingMap.get(key) !== 'zalNietStemmen') {
        this.votingMap.set(key, 'onthouding');
      }
    }
    this.refreshMap();
  }
}
