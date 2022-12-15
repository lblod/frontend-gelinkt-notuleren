import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default class AttachmentsNumberComponent extends Component {
  constructor(...args) {
    super(...args);
    this.getAttachmentsNumber.perform();
  }
  @service router;
  @service store;

  @tracked attachmentsNumber;

  getAttachmentsNumber = task({ restartable: true }, async () => {
    const attachments = await this.args.documentContainer.attachments;
    this.attachmentsNumber = attachments.length;
  });
}
