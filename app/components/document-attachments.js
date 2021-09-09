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

  typeOptions=[{
    id: REGULATORY_TYPE_ID,
    label: this.intl.t("attachments.regulatory")
  }];

  @tracked selectedType;
  
  @task
  *onSelectType(attachment, event){
    const selectedId=event.target.value;
    if(!selectedId){
      attachment.type=null;  
    }
    else{
      const concept=yield this.store.findRecord('concept', selectedId);
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
  *uploadedAttachement(file) {
    const documentContainer = yield this.args.documentContainer;
    const newAttachment = yield this.store.createRecord('attachment');

    newAttachment.file = file;
    newAttachment.documentContainer = documentContainer;

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
