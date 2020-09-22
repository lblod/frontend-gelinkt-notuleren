import Component from '@glimmer/component';
import { action } from "@ember/object";
import { tracked } from '@glimmer/tracking';

export default class MeetingForm extends Component{
  geplandeStart;
  gestartOpTijdstip;
  geeindigdOpTijdstip;
  opLocatie;

  constructor() {
    super(...arguments);
    if(this.args.zitting) {
      this.geplandeStart = this.args.zitting.geplandeStart;
      this.gestartOpTijdstip = this.args.zitting.gestartOpTijdstip;
      this.geeindigdOpTijdstip = this.args.zitting.geeindigdOpTijdstip;
      this.opLocatie = this.args.zitting.opLocatie;
    }
  }

  @action
  select() {
    console.log('selected');
  }
  @action
  save() {
    console.log(this.opLocatie)
    const info = {
      geplandeStart: this.geplandeStart,
      gestartOpTijdstip: this.gestartOpTijdstip,
      geeindigdOpTijdstip: this.geeindigdOpTijdstip,
      opLocatie : this.opLocatie
    };
    this.args.save(info);
  }
}
