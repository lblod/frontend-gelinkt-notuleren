import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from "@glimmer/tracking";
import { task } from 'ember-concurrency-decorators';
import { inject as service } from '@ember/service';

export default class MeetingsEditTreatmentController extends Controller {
  @service router;
  @service currentSession;
  @tracked editor;
  @tracked document;

  @action
  closeModal() {
    this.router.transitionTo('meetings.edit', this.model.meetingId);
  }

  @action
  handleRdfaEditorInit(document, editor) {
    console.log("DOCUMENT", document);
    if (document.content) {
      editor.setHtmlContent(document.get('content'));
    }
    this.editor = editor;
  }
  get documentContainer() {
    return this.model.treatment.documentContainer;
  }
  set documentContainer(container) {
    this.model.treatment.documentContainer = container;
  }
  @task
  *saveDocumentTask(editorDocument) {
    // create or extract properties
    let cleanedHtml = this.editor.htmlContent;
    let createdOn = editorDocument.get("createdOn") || new Date();
    let updatedOn = new Date();
    let title = editorDocument.get("title");
    if (!this.documentContainer) {
      this.documentContainer = yield this.store
        .createRecord("document-container")
        .save();
    }
    let documentContainer = yield this.documentContainer;
    let status = yield documentContainer.get("status");
    let folder = yield documentContainer.get("folder");

    if (status && status.isLoaded && folder && folder.isLoaded) {
      // every save results in new document
      let documentToSave = this.store.createRecord("editor-document", {
        content: cleanedHtml,
        createdOn,
        updatedOn,
        title,
        documentContainer,
      });

      // Link the previous if provided editorDocument does exist in DB.
      if (editorDocument.get("id"))
        documentToSave.set("previousVersion", editorDocument);

      try {
        // save the document
        yield documentToSave.save();
      } catch (e) {
        console.error("Error saving the document");
        console.error(e);
      }

      // set the latest revision
      documentContainer.set("currentVersion", documentToSave);
      documentContainer.set("status", status);
      documentContainer.set("folder", folder);
      const bestuurseenheid = this.currentSession.group;
      documentContainer.set("publisher", bestuurseenheid);

      try {
        yield documentContainer.save();
      } catch (e) {
        console.error("Error saving the document container");
        console.error(e);
      }

      this.document = documentToSave;
      this.model.treatment.documentContainer = documentContainer;
      this.model.treatment.save();


    } else {
      console.error(`The status or the folder didn't correctly load`);
    }
  }
}
