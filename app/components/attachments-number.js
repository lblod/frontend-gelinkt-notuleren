import Component from '@glimmer/component';
import { restartableTask } from 'ember-concurrency';
import { useTask } from 'ember-resources';

export default class AttachmentsNumberComponent extends Component {
  @restartableTask
  *getAttachmentsNumber(attachments) {
    const allAttachments = yield attachments;
    return allAttachments.meta.count;
  }

  //can pass in tracked props
  attachmentsNumber = useTask(this, this.getAttachmentsNumber, () => [
    this.args.documentContainer.attachments,
  ]);
}
