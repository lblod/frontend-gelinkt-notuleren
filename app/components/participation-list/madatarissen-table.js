import Component from '@glimmer/component';
import { action } from "@ember/object";

export default class ParticipationListMandatariesTableComponent extends Component {
  selectedMandatees = {}
  constructor() {
    super(...arguments);
    if(this.args.selected) {
      this.args.selected.forEach((mandataris) => {
        this.selectedMandatees[mandataris.uri] = mandataris;
      });
    } else {
      this.args.mandataris.forEach((mandataris) => {
        this.selectedMandatees[mandataris.uri] = mandataris;
      });
    }
  }
  @action
  toggleAanwezigheid(mandataris, selected){
    if(selected) {
      this.selectedMandatees[mandataris.uri] = mandataris;
    } else {
      this.selectedMandatees[mandataris.uri] = undefined;
    }
    const selectedMandatees = Object.values(this.selectedMandatees);
    this.args.onChange(selectedMandatees.filter((mandataris) => mandataris));
  }
}
