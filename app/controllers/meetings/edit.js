import Controller from '@ember/controller';
import { action } from "@ember/object";

export default class MeetingsEditController extends Controller {

  @action
  async save(info) {
    this.model.geplandeStart = info.geplandeStart;
    this.model.gestartOpTijdstip = info.gestartOpTijdstip;
    this.model.geeindigdOpTijdstip = info.geeindigdOpTijdstip;
    this.model.opLocatie = 'Gent';
    await this.model.save();
  }
}
