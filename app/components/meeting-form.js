import Component from "@glimmer/component";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";
import { task } from "ember-concurrency-decorators";
import { inject as service } from "@ember/service";
import isValidMandateeForMeeting from 'frontend-gelinkt-notuleren/utils/is-valid-mandatee-for-meeting';

/** @typedef {import("../models/agendapunt").default[]} Agendapunt */

export default class MeetingForm extends Component {
  @tracked aanwezigenBijStart;
  @tracked aanwezigenRoles;
  @tracked voorzitter;
  @tracked secretaris;
  @tracked zitting;
  @tracked bestuursorgaan;
  @tracked possibleParticipants;
  @tracked behandelingen;
  @service store;
  @service currentSession;
  @service router;

  constructor() {
    super(...arguments);
    this.zitting = this.args.zitting;
    this.loadData.perform();
  }

  get isComplete() {
    return ! this.zitting.isNew && this.behandelingen?.length > 0;
  }

  @task
  *loadData() {
    if (this.zitting.get("id")) {
      this.bestuursorgaan = yield this.zitting.get("bestuursorgaan");
      this.secretaris = yield this.zitting.get("secretaris");
      this.voorzitter = yield this.zitting.get("voorzitter");
      if (this.bestuursorgaan) {
        yield this.fetchPossibleParticipants.perform();
      }
      yield this.fetchParticipants.perform();
      yield this.fetchTreatments.perform();
    }
  }

  @task
  *fetchParticipants() {
    let queryParams = {
      include: 'is-bestuurlijke-alias-van,status',
      sort: 'is-bestuurlijke-alias-van.achternaam',
      'filter[aanwezig-bij-zitting][:id:]': this.zitting.get('id'),
      page: { size: 100 } //arbitrary number, later we will make sure there is previous last. (also like this in the plugin)
    };
    const mandatees = yield this.store.query('mandataris', queryParams);
    this.aanwezigenBijStart = mandatees;
  }

  @task
  *fetchPossibleParticipants() {
    this.aanwezigenRoles = yield this.store.query('bestuursfunctie-code', { 'filter[standaard-type-van][is-classificatie-van][heeft-tijdsspecialisaties][:id:]': this.bestuursorgaan.id});
    const stringifiedDefaultTypeIds = this.aanwezigenRoles.map(t => t.id).join(',');
    let queryParams = {
      include: 'is-bestuurlijke-alias-van,status',
      sort: 'is-bestuurlijke-alias-van.achternaam',
      'filter[bekleedt][bevat-in][:uri:]': this.bestuursorgaan.get('uri'),
      'filter[bekleedt][bestuursfunctie][:id:]': stringifiedDefaultTypeIds,
      page: { size: 100 } //arbitrary number, later we will make sure there is previous last. (also like this in the plugin)
    };
    const mandatees = yield this.store.query('mandataris', queryParams);
    this.possibleParticipants = Array.from(
      mandatees.filter( (mandatee) => isValidMandateeForMeeting(mandatee, this.zitting) )
    );
  }

  @task
  *fetchTreatments() {
    const zitting = yield this.zitting;
    const treatments = new Array();
    const pageSize = 20;
    const firstPage = yield this.store.query('behandeling-van-agendapunt', {
      include: "voorzitter,secretaris",
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

  @action
  async meetingInfoUpdate(zitting) {
    const bestuursorgaan = await zitting.get("bestuursorgaan");
    if (bestuursorgaan != this.bestuursorgaan) {
      this.bestuursorgaan = bestuursorgaan;
      this.fetchPossibleParticipants.perform();
    }
  }
}
