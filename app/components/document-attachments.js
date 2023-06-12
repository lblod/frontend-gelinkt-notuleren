import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { REGULATORY_TYPE_ID } from 'frontend-gelinkt-notuleren/utils/constants';

export default class DocumentAttachmentsComponent extends Component {
  constructor(...args) {
    super(...args);
    this.fetchAttachments.perform();
  }

  @service store;
  @service intl;
  @tracked attachments;
  @tracked decisions;
  regulatoryTypeId = REGULATORY_TYPE_ID;

  updateAttachmentIsRegulatory = task(async (attachment, isRegulatory) => {
    if (!isRegulatory) {
      attachment.type = null;
    } else {
      const concept = await this.store.findRecord(
        'concept',
        REGULATORY_TYPE_ID
      );
      attachment.type = concept;
    }
    await attachment.save();
  });

  onSelectDecision = task(async (attachment, event) => {
    const selectedId = event.target.value;
    attachment.decision = selectedId;
    await attachment.save();
  });

  fetchAttachments = task(async () => {
    this.attachments = await this.store.query('attachment', {
      page: { size: 100 },
      'filter[document-container][:id:]': this.args.documentContainer.id,
      include: 'type',
    });
  });

  uploadedAttachement = task(async (fileId) => {
    const file = await this.store.findRecord('file', fileId);
    const documentContainer = await this.args.documentContainer;
    const newAttachment = await this.store.createRecord('attachment');

    newAttachment.file = file;
    newAttachment.documentContainer = documentContainer;
    if (this.args.decisions.length === 1) {
      newAttachment.decision = this.args.decisions[0].uri;
    }

    await newAttachment.save();

    //there has to be a better way to do this
    await this.fetchAttachments.perform();
  });

  deleteAttachment = task(async (attachment) => {
    const file = await attachment.file;
    file.destroyRecord();
    await attachment.destroyRecord();
  });
}
