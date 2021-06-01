import Component from '@glimmer/component';
import { action } from "@ember/object";
import { tracked } from '@glimmer/tracking';

export default class ZittingManageZittingsdataComponent extends Component {
  @tracked showModal = false;

  @tracked geplandeStart;
  @tracked gestartOpTijdstip;
  @tracked geeindigdOpTijdstip;
  @tracked opLocatie;
  @tracked bestuursorgaan;

  constructor() {
    super(...arguments);
    this.initializeState();
  }
  initializeState() {
    this.zitting = this.args.zitting;
    this.geplandeStart = this.args.zitting.geplandeStart;
    this.gestartOpTijdstip = this.args.zitting.gestartOpTijdstip;
    this.geeindigdOpTijdstip = this.args.zitting.geeindigdOpTijdstip;
    this.opLocatie = this.args.zitting.opLocatie;
    this.bestuursorgaan = this.args.zitting.bestuursorgaan;

  }

  @action
  async saveZittingsData(){
    this.zitting.geplandeStart = this.geplandeStart;
    this.zitting.gestartOpTijdstip = this.gestartOpTijdstip;
    this.zitting.geeindigdOpTijdstip = this.geeindigdOpTijdstip;
    this.zitting.opLocatie = this.opLocatie;
    this.zitting.bestuursorgaan = this.bestuursorgaan;

    await this.zitting.save();
    this.toggleModal();
    this.args.onChange(this.zitting);
  }

  @action
  cancel() {
    this.zitting.rollbackAttributes();
    this.initializeState();
    this.toggleModal();
  }
  @action
  toggleModal() {
    this.showModal = !this.showModal;
  }

  @action
  changeDate(targetProperty, value) {
    this[targetProperty] = value;
  }

}
