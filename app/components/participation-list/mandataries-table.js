import Component from '@glimmer/component';
import { action } from "@ember/object";

export default class ParticipationListMandatariesTableComponent extends Component {
  selectedAanwezige = {}
  @action
  add() {

  }
  @action
  selectAanwezige() {

  }
  @action
  addAanwezige() {

  }
  @action
  addAanwezigeCancel() {

  }
  @action
  toggleAanwezigheid(aanwezige, selected){
    if(selected) {
      this.selectedAanwezige[aanwezige.uri] = aanwezige
    } else {
      this.selectedAanwezige[aanwezige.uri] = undefined
    }
    this.args.onChange(Object.values(this.selectedAanwezige))
  }
}
