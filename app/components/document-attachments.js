import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class DocumentAttachmentsComponent extends Component {
  
  @service store;

  @task
  *uploadedAttachement(fileResource){
    const documentContainer=yield this.args.documentContainer;
    const newAttachment=yield this.store.createRecord('attachment');
    
    newAttachment.fileResource=fileResource;
    newAttachment.documentContainer=documentContainer;

    yield newAttachment.save();
  }

  @task
  *deleteAttachment(attachment){
    const fileResource=yield attachment.fileResource;
    const fileId=fileResource.id;
    const response = yield fetch(`/files/${fileId}`, {method: 'DELETE'});
    yield attachment.destroyRecord();
  }
}
