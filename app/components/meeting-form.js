import Component from '@glimmer/component';
import { action } from "@ember/object";
import { tracked } from '@glimmer/tracking';

export default class MeetingForm extends Component{
  geplandeStart;
  gestartOpTijdstip;
  geeindigdOpTijdstip;

  constructor() {
    super(...arguments);
    if(this.args.zitting) {
      this.geplandeStart = this.args.zitting.geplandeStart;
      this.gestartOpTijdstip = this.args.zitting.gestartOpTijdstip;
      this.geeindigdOpTijdstip = this.args.zitting.geeindigdOpTijdstip;
    }
  }

  @action
  select() {
    console.log('selected');
  }
  @action
  save() {
    const info = {
      geplandeStart: this.geplandeStart,
      gestartOpTijdstip: this.gestartOpTijdstip,
      geeindigdOpTijdstip: this.geeindigdOpTijdstip
    };
    this.args.save(info);
  }
}
