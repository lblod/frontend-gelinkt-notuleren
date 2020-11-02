import Component from '@glimmer/component';
import { action } from "@ember/object";
import { tracked } from '@glimmer/tracking';

export default class ParticipationListMandatarisRowComponent extends Component {
  @tracked selected;
  constructor() {
    super(...arguments);
    this.selected = this.args.selectedMandatees[this.args.mandataris.uri];
  }
  @action
  toggle() {
    this.selected = !this.selected;
    this.args.onToggleAanwezig(this.selected);
  }
}
