import Component from '@glimmer/component';
import { action } from "@ember/object";
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class MeetingForm extends Component{
  @tracked aanwezigenBijStart;
  @tracked voorzitter;
  @tracked secretaris;
  @tracked zitting;

  constructor() {
    super(...arguments);
    this.zitting = this.args.zitting;
    this.secretaris = this.args.zitting.get('secretaris');
    this.voorzitter = this.args.zitting.get('voorzitter');
    this.aanwezigenBijStart = this.args.zitting.get('aanwezigenBijStart');
  }

  @action
  async saveParticipationList({voorzitter, secretaris, aanwezigenBijStart}) {
    this.zitting.voorzitter = voorzitter;
    this.zitting.secretaris = secretaris;
    this.zitting.aanwezigenBijStart = aanwezigenBijStart;
    await this.zitting.save();
  }

}
