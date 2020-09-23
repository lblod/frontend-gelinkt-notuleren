import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from "@ember/object";

export default class ParticipationListComponent extends Component {
  bestuursorgaan;
  @tracked popup = false;
  constructor() {
    super(...arguments)
    this.bestuursorgaan = this.args.bestuursorgaan
  }
  @action
  togglePopup() {
    this.popup = true
  }
  @action
  insert() {

  }
}
