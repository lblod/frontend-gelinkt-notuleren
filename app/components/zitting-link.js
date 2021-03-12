import Component from '@glimmer/component';
import {tracked} from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { restartableTask } from "ember-concurrency-decorators";


export default class ZittingLinkComponent extends Component {
  constructor(...args){
    super(...args);
    this.getMeeting.perform();
  }
  @service router;
  @service store;

  @tracked meeting;

  @restartableTask
  * getMeeting(){
    const result = yield this.store.query("zitting", {
      'filter[agendapunten][behandeling][document-container][:id:]':this.args.documentContainer.id
    });
    this.meeting = result.firstObject;
  }
}
