import Controller from '@ember/controller';

export default class AgendapointsAttachmentsController extends Controller {
  get documentContainer() {
    return this.model.documentContainer;
  }

  get editorDocument() {
    return this.model.editorDocument;
  }

  get decisions() {
    return this.model.decisions;
  }
}
