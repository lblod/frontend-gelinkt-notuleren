import Controller from '@ember/controller';
import { action } from "@ember/object";
import { inject as service } from '@ember/service';

export default class MeetingsEditController extends Controller {
  @service store

  @action
  async save(info) {
    const zitting = await this.store.findRecord('zitting', this.id);
    zitting.geplandeStart = info.plannedStart;
    zitting.gestartOpTijdstip = info.startedAt;
    zitting.geeindigdOpTijdstip = info.finishedAt;
    zitting.opLocatie = 'Gent';
    await zitting.save();
  }
}
