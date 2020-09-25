import Controller from '@ember/controller';
import { action } from "@ember/object";

export default class MeetingsEditController extends Controller {

  @action
  async save(info) {
    this.model.geplandeStart = info.geplandeStart;
    this.model.gestartOpTijdstip = info.gestartOpTijdstip;
    this.model.geeindigdOpTijdstip = info.geeindigdOpTijdstip;
    this.model.opLocatie = info.opLocatie;
    this.model.bestuursorgaan = info.bestuursorgaan;
    this.model.secretaris = info.secretaris;
    this.model.voorzitter = info.voorzitter;
    this.model.aanwezigenBijStart = info.aanwezigenBijStart;
    await this.model.save();
    this.transitionToRoute('inbox.meetings');
  }
}
