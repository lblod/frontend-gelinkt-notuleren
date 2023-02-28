import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default class InboxUploadController extends Controller {
  @service store;
  @service toaster;
  @service houseCss;

  @task
  uploadedAttachement(fileId) {
    this.toaster.success(
      'CSS file uploaded and will be applied after page refresh',
      'File uploaded',
      {
        timeOut: 3000,
        closable: false,
      }
    );

    this.houseCss.setFileId(fileId);
  }
}
