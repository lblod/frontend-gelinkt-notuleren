import Component from '@glimmer/component';
import { action } from "@ember/object";
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class MeetingForm extends Component{
  @tracked geplandeStartDate;
  @tracked gestartOpTijdstip;
  @tracked geeindigdOpTijdstip;
  @tracked opLocatie;
  @tracked bestuursorgaan;
  @tracked bestuursorgaanOptions;

  @service store;

  constructor() {
    super(...arguments);
    if(this.args.zitting) {
      this.geplandeStart = this.args.zitting.geplandeStart;
      this.gestartOpTijdstip = this.args.zitting.gestartOpTijdstip;
      this.geeindigdOpTijdstip = this.args.zitting.geeindigdOpTijdstip;
      this.opLocatie = this.args.zitting.opLocatie;
    }
    this.fetchBestuursorgaan();
  }

  async fetchBestuursorgaan() {
    this.bestuursorgaanOptions = await this.store.findAll('bestuursorgaan');
  }

  @action
  changeSelect(value) {
    this.bestuursorgaan = value;
  }

  @action
  changeDate(property, value) {
    this[property] = value;
  }

  @action
  save() {
    const info = {
      geplandeStart: this.geplandeStart,
      gestartOpTijdstip: this.gestartOpTijdstip,
      geeindigdOpTijdstip: this.geeindigdOpTijdstip,
      opLocatie : this.opLocatie,
      bestuursorgaan: this.bestuursorgaan
    };
    this.args.save(info);
  }
}
