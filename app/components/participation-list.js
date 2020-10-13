import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from "@ember/object";
import { inject as service } from '@ember/service';
import {task} from 'ember-concurrency-decorators';

export default class ParticipationListComponent extends Component {
  @tracked popup = false;
  @tracked info;
  @tracked mandataris;
  @tracked voorzitter;
  @tracked secretaris;
  @tracked aanwezigenBijStart;
  @tracked bestuursorgaan;
  @tracked mandatees;

  @service store;

  constructor() {
    super(...arguments);
    this.voorzitter = this.args.zitting.voorzitter;
    this.secretaris = this.args.zitting.secretaris;
    this.aanwezigenBijStart = this.args.zitting.aanwezigenBijStart;
    this.bestuursorgaan = this.args.zitting.bestuursorgaan;
    this.loadData.perform();
  }
  @task
  *loadData() {
    yield this.fetchMandatees();
  }

  async fetchMandatees() {
    const bestuursorgaanUri = this.bestuursorgaan && this.bestuursorgaan.get('uri');
    let queryParams = {
      'filter[bekleedt][bevat-in][:uri:]': bestuursorgaanUri,
      include: 'is-bestuurlijke-alias-van',
      page: { size: 100 } //arbitrary number, later we will make sure there is previous last. (also like this in the plugin)
    };
    this.mandatees = await this.store.query('mandataris', queryParams);
  }

  get hasParticipationInfo() {
    return !!(this.voorzitter.content || this.secretaris.content || this.aanwezigenBijStart.content.length);
  }

  get mandateesNotPresent() {
    if(this.aanwezigenBijStart && this.mandatees) {
      const aanwezigenUris = this.aanwezigenBijStart.map((mandataris) => mandataris.uri);
      const notPresent = this.mandatees.filter((mandataris) => !aanwezigenUris.includes(mandataris.uri));
      return notPresent;
    }
    return [];
  }

  @action
  togglePopup(e) {
    e.preventDefault()
    this.popup = !this.popup;
  }
  @action
  onSave(info) {
    this.args.onSave(info);
  }
}
