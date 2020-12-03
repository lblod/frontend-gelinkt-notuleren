import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from "@ember/object";
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import { get } from '@ember/object';

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

  get dataLoading() {
    return this.loadData.isRunning || get(this.voorzitter, 'isLoading') || get(this.secretaris,'isLoading') || get(this.aanwezigenBijStart, 'isLoading') || get(this.bestuursorgaan, 'isLoading');
  }

  @task
  *loadData() {
    yield this.fetchMandatees();
  }

  async fetchMandatees() {
    const bestuursorgaanUri = this.bestuursorgaan && this.bestuursorgaan.get('uri');
    const today=(new Date).toISOString().split('T')[0];
    let queryParams = {
      'filter[bekleedt][bevat-in][:uri:]': bestuursorgaanUri,
      include: 'is-bestuurlijke-alias-van',
     'filter[:lt:einde]': today,
      page: { size: 100 } //arbitrary number, later we will make sure there is previous last. (also like this in the plugin)
    };
    this.mandatees = await this.store.query('mandataris', queryParams);
  }

  // this is only called after loading has finished
  get hasParticipationInfo() {
    return Boolean(this.aanwezigenBijStart.length > 0 || this.voorzitter.id || this.secretaris.id);
  }
  get mandateesPresent(){
    const sorted=this.aanwezigenBijStart.sortBy('isBestuurlijkeAliasVan.achternaam');
    return sorted;
  }
  get mandateesNotPresent() {
    if(this.aanwezigenBijStart && this.mandatees) {
      const aanwezigenUris = this.aanwezigenBijStart.map((mandataris) => mandataris.uri);
      const notPresent = this.mandatees.filter((mandataris) => !aanwezigenUris.includes(mandataris.uri));
      const sorted=notPresent.sortBy('isBestuurlijkeAliasVan.achternaam');
      return sorted;
    }
    return [];
  }

  @action
  togglePopup(e) {
    if(e) {
      e.preventDefault();
    }
    this.popup = !this.popup;
  }

  @action
  onSave(info) {
    this.args.onSave(info);
  }
}
