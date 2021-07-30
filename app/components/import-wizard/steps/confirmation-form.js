import Component from '@glimmer/component';
import {action} from '@ember/object';

export default class SelectDocumentComponent extends Component {

  @action
  updateAdministrativeBody(administrativeBody) {
    this.args.meeting.bestuursorgaan = administrativeBody;
    this.args.meeting.errors.remove('bestuursorgaan');
  }

}