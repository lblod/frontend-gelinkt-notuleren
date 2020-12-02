import Component from '@glimmer/component';
import {action} from '@ember/object';
import {tracked} from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { restartableTask } from "ember-concurrency-decorators";


export default class ZittingLinkComponent extends Component {
  constructor(...args){
    super(...args);
    this.getAgendapuntName.perform();
  }
  @service router;
  @service store;

  @tracked agendapuntName;

  @restartableTask
  * getAgendapuntName(){
    const agendapunt=(yield this.store.query('agendapunt', {'filter[behandeling][document-container][:id:]': this.args.documentContainer.id})).firstObject;
    this.agendapuntName=agendapunt.titel;
  }
  @action
  async openZitting(){
    const zitting=(await this.store.query("zitting", {'filter[agendapunten][behandeling][document-container][:id:]':this.args.documentContainer.id})).firstObject;
    this.router.transitionTo('meetings.edit', zitting.id);
  }
}
