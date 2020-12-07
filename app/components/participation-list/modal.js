import Component from '@glimmer/component';
import { action } from "@ember/object";
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import {task} from 'ember-concurrency-decorators';

export default class ParticipationListModalComponent extends Component {
  @tracked voorzitter;
  @tracked mandataris;
  @tracked secretaris;
  @tracked aanwezigenBijStart;
  @service store;

  constructor() {
    super(...arguments);
    this.voorzitter = this.args.voorzitter;
    this.secretaris = this.args.secretaris;
  }


  @action
  togglePopup(e) {
    if(e) {
      e.preventDefault();
    }
    this.args.togglePopup(e);
  }
  @action
  selectVoorzitter(value){
    this.voorzitter = value;
  }
  @action
  selectSecretaris(value){
    this.secretaris = value;
  }
  @action
  updateMandatarisTable(aanwezigenBijStart) {
    this.aanwezigenBijStart = aanwezigenBijStart;
  }
  @action
  insert(e){
    e.preventDefault();
    const info = {
      voorzitter: this.voorzitter,
      secretaris: this.secretaris,
      aanwezigenBijStart: this.aanwezigenBijStart
    };
    this.args.onSave(info);
    this.args.togglePopup(e);
  }
}
