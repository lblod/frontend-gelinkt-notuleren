import Controller from '@ember/controller';
import { action } from "@ember/object";
import { inject as service } from '@ember/service';

export default class MeetingsNewController extends Controller {
  @service store

  @action
  async save() {
    console.log('save from controller')
    const zitting = this.store.createRecord('zitting', {
      geplandeStart: new Date(),
      gestartOpTijdstip: new Date(),
      geeindigdOpTijdstip: new Date(),
      opLocatie: 'Gent',
    })
    await zitting.save()
  }
}
