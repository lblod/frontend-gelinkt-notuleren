import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import {REGULATORY_TYPE_ID}  from 'frontend-gelinkt-notuleren/utils/constants';

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

  @task
  *updateAttachmentIsRegulatory(attachment, isRegulatory) {
    if(!isRegulatory){
      attachment.type=null;
    }
    else{
      const concept=yield this.store.findRecord('concept', REGULATORY_TYPE_ID);
      attachment.type=concept;
    }
    yield attachment.save();
  }

  @task
  *onSelectDecision(attachment, event) {
    const selectedId = event.target.value;
    attachment.decision = selectedId;
    yield attachment.save();
  }

  @task
  *fetchAttachments() {
    this.attachments = yield this.store.query('attachment', {
      page: { size: 100 },
      'filter[document-container][:id:]': this.args.documentContainer.id,
      include: "type"
    });
  }

  @task
  *uploadedAttachement(fileId) {
    const file = yield this.store.findRecord('file', fileId);
    const documentContainer = yield this.args.documentContainer;
    const newAttachment = yield this.store.createRecord('attachment');

    newAttachment.file = file;
    newAttachment.documentContainer = documentContainer;
    if (this.args.decisions.length === 1) {
      newAttachment.decision = this.args.decisions[0];
    }

    yield newAttachment.save();

    //there has to be a better way to do this
    yield this.fetchAttachments.perform();
  }

  @task
  *deleteAttachment(attachment) {
    const file = yield attachment.file;
    file.destroyRecord();
    yield attachment.destroyRecord();
  }
}
