import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class AgendaManagerDeleteComponent extends Component {
  @tracked isShowingWarning=false;

  @tracked hasAgreed=false;

  @action
  toggleWarning(){
    this.isShowingWarning=!this.isShowingWarning;
  }
  @action
  reset() {
    this.isShowingWarning = false;
    this.hasAgreed = false;
  }

}
