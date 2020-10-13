import Component from '@glimmer/component';
import { action } from "@ember/object";
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';
import { inject as service } from '@ember/service';

/** @typedef {import("../models/agendapunt").default[]} Agendapunt */

export default class MeetingForm extends Component {

  @tracked aanwezigenBijStart;
  @tracked voorzitter;
  @tracked secretaris;
  @tracked zitting;
  @tracked behandelingen;
  @service store;

  constructor() {
    super(...arguments);
    this.zitting = this.args.zitting;
    this.secretaris = this.args.zitting.get('secretaris');
    this.voorzitter = this.args.zitting.get('voorzitter');
    this.aanwezigenBijStart = this.args.zitting.get('aanwezigenBijStart');
    this.fetchBehandelingen.perform();

  }

  @task
  fetchBehandelingen = function*() {
    /** @type {Agendapunt} */
    const agenda = yield this.zitting.agendapunten;
    const behandelingen = yield this.store.query('behandeling-van-agendapunt', {
      'filter[onderwerp][:id:]': agenda.map(punt => punt.id).join(",")
    })
    this.behandelingen = behandelingen;

  }

  @action
  async saveParticipationList({ voorzitter, secretaris, aanwezigenBijStart }) {
    this.zitting.voorzitter = voorzitter;
    this.zitting.secretaris = secretaris;
    this.zitting.aanwezigenBijStart = aanwezigenBijStart;
    await this.zitting.save();
  }

}
