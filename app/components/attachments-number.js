import Component from '@glimmer/component';
import {tracked} from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { restartableTask } from "ember-concurrency";

export default class AttachmentsNumberComponent extends Component {
  constructor(...args){
    super(...args);
    this.getAttachmentsNumber.perform();
  }
  @service router;
  @service store;

  @tracked attachmentsNumber;

  @restartableTask
  * getAttachmentsNumber(){
    const attachments = yield this.args.documentContainer.attachments;
    this.attachmentsNumber = attachments.meta.count;
  }
}

