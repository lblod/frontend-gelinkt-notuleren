import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from "@ember/object";

export default class ParticipationListComponent extends Component {
  @tracked popup = false;
  @tracked info;
  @action
  togglePopup() {
    this.popup = !this.popup;
  }
  @action
  onSave(info) {
    this.args.onSave(info);
  }
}
