import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from "@ember/object";
import { inject as service } from '@ember/service';
import {task} from 'ember-concurrency-decorators'

export default class ParticipationListComponent extends Component {
  @tracked popup = false;
  @tracked info;
  @tracked mandataris;

  @service store;

  constructor() {
    super(...arguments);
  }

  @task
  *fetchMandataris() {
    const bestuursorgaanUri = this.args.bestuursorgaan && this.args.bestuursorgaan.get('uri');
    if(!bestuursorgaanUri) {
      return setTimeout(this.fetchMandataris.bind(this), 200);
    }
    let queryParams = {
      'filter[bekleedt][bevat-in][:uri:]': bestuursorgaanUri
    };
    this.mandataris =  yield this.store.query('mandataris', queryParams);
  }
  
  get hasParticipationInfo() {
    return this.args.voorzitter || this.args.secretaris || this.args.aanwezigenBijStart;
  }

  get mandateesNotPresent() {
    if(this.args.aanwezigenBijStart && this.mandataris) {
      const aanwezigenUris = this.args.aanwezigenBijStart.map((mandataris) => mandataris.uri)
      const notPresent = this.mandataris.filter((mandataris) => !aanwezigenUris.includes(mandataris.uri));
      return notPresent;
    }
    return undefined;
  }

  @action
  togglePopup() {
    this.popup = !this.popup;
  }
  @action
  onSave(info) {
    this.args.onSave(info);
  }
}
