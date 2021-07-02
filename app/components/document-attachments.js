import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class DocumentAttachmentsComponent extends Component {
  constructor(...args) {
    super(...args);
    this.fetchAttachments.perform();
  }

  @service store;
  @tracked attachments;

  @task
  *fetchAttachments() {
    this.attachments = yield this.store.query('attachment', {
      page: { size: 100 },
      'filter[document-container][:id:]': this.args.documentContainer.id
    });
  }

  @task
  *uploadedAttachement(fileResource) {
    const documentContainer = yield this.args.documentContainer;
    const newAttachment = yield this.store.createRecord('attachment');

    newAttachment.fileResource = fileResource;
    newAttachment.documentContainer = documentContainer;

    yield newAttachment.save();

    //there has to be a better way to do this
    yield this.fetchAttachments.perform();
  }

  @task
  *deleteAttachment(attachment) {
    const fileResource = yield attachment.fileResource;
    const fileId = fileResource.id;
    yield fetch(`/files/${fileId}`, { method: 'DELETE' });
    yield attachment.destroyRecord();
  }
}
