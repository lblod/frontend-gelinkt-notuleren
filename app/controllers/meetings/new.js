import Controller from '@ember/controller';
import { action } from "@ember/object";
import { inject as service } from '@ember/service';

export default class MeetingsNewController extends Controller {
  @service store

  @action
  async save(info) {
    const zitting = this.store.createRecord('zitting', {
      geplandeStart: info.plannedStart,
      gestartOpTijdstip: info.startedAt,
      geeindigdOpTijdstip: info.finishedAt,
      opLocatie: 'Gent',
    });
    await zitting.save();
  }
}
