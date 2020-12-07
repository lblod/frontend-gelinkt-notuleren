import Component from "@glimmer/component";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";
import { task } from "ember-concurrency-decorators";
import { inject as service } from "@ember/service";

/** @typedef {import("../models/agendapunt").default[]} Agendapunt */

export default class MeetingForm extends Component {
  @tracked aanwezigenBijStart;
  @tracked voorzitter;
  @tracked secretaris;
  @tracked zitting;
  @tracked behandelingen;
  @service store;
  @service currentSession;
  @service router;

  constructor() {
    super(...arguments);
    this.zitting = this.args.zitting;
    this.secretaris = this.args.zitting.get("secretaris");
    this.voorzitter = this.args.zitting.get("voorzitter");
    this.aanwezigenBijStart = this.args.zitting.get("aanwezigenBijStart");
    this.fetchTreatments.perform();
  }
  get isComplete() {
    return this.args.zitting.bestuursorgaan && this.behandelingen;
  }

  @task
  *fetchTreatments() {
    const zitting = yield this.zitting;
    const treatments = new Array();
    const pageSize = 20;
    const firstPage = yield this.store.query('behandeling-van-agendapunt', {
      "filter[onderwerp][zitting][:id:]": this.args.zitting.id ,
      "page[size]": pageSize,
      sort: 'onderwerp.position'
    });
    const count = firstPage.meta.count;
    firstPage.forEach(result => treatments.push(result));
    let pageNumber = 1;
    while (((pageNumber) * pageSize) < count) {
      const pageResults = yield this.store.query('behandeling-van-agendapunt', {
        "filter[onderwerp][zitting][:id:]": this.args.zitting.id ,
        "page[size]": pageSize,
        "page[number]": pageNumber,
        sort: 'onderwerp.position'
      });
      pageResults.forEach(result => treatments.push(result));
      pageNumber++;
    }
    this.behandelingen = treatments;
  }

  @action
  async saveParticipationList({ voorzitter, secretaris, aanwezigenBijStart }) {
    this.secretaris = secretaris;
    this.voorzitter = voorzitter;
    this.aanwezigenBijStart = aanwezigenBijStart;
    this.zitting.voorzitter = voorzitter;
    this.zitting.secretaris = secretaris;
    this.zitting.aanwezigenBijStart = aanwezigenBijStart;
    await this.zitting.save();
  }

  @action
  goToPublish() {
    this.router.transitionTo("meetings.publish.agenda", this.args.zitting.id);
  }
}
