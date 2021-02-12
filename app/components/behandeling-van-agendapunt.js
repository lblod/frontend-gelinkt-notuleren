import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { task } from "ember-concurrency-decorators";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";

export default class BehandelingVanAgendapuntComponent extends Component {
  @tracked openbaar;
  @tracked document;
  @tracked documentContainer;
  @service store;
  @service currentSession;
  @tracked behandeling;
  @tracked editor;
  @tracked aanwezigen = new Array();

  constructor() {
    super(...arguments);
    this.openbaar = this.args.behandeling.openbaar;
    this.behandeling = this.args.behandeling;
    this.documentContainer = this.args.behandeling.documentContainer;
    this.tryToFetchDocument.perform();
    this.fetchParticipants.perform();
  }

  get hasParticipants() {
    return this.aanwezigen.length;
  }

  /**
   * @typedef {Object} ParticipantInfo
   * @property {Mandataris} voorzitter
   * @property {Mandataris} secretaris
   * @property {Mandataris[]} aanwezigenBijStart
   */

  /**
   * @param {ParticipantInfo} participants
   */
  @action
  async saveParticipants(participants) {
    this.behandeling.voorzitter = participants.voorzitter;
    this.voorzitter = participants.voorzitter;
    this.behandeling.secretaris = participants.secretaris;
    this.secretaris = participants.secretaris;
    this.behandeling.aanwezigen = participants.aanwezigenBijStart;
    this.aanwezigen = participants.aanwezigenBijStart;
    await this.behandeling.save();
  }

  @task
  *fetchParticipants() {
    let queryParams = {
      sort: 'is-bestuurlijke-alias-van.achternaam',
      'filter[aanwezig-bij-behandeling][:id:]': this.args.behandeling.get('id'),
      include: 'is-bestuurlijke-alias-van',
      page: { size: 100 } //arbitrary number, later we will make sure there is previous last. (also like this in the plugin)
    };
    const aanwezigen = yield this.store.query('mandataris', queryParams);
    this.aanwezigen = aanwezigen;
    this.behandeling.aanwezigen = aanwezigen;
    this.voorzitter = yield this.behandeling.voorzitter;
    this.secretaris = yield this.behandeling.secretaris;
  }

  @task
  *tryToFetchDocument() {
    yield this.args.behandeling.documentContainer;
    if (this.documentContainer.content) {
      this.document = yield this.documentContainer.get("currentVersion");
      if (!this.document) {
        this.document = this.store.createRecord("editor-document", {
          createdOn: new Date(),
          updatedOn: new Date()
        });
      }
    } else {
      yield this.behandeling.onderwerp;
      this.document = this.store.createRecord("editor-document", {
        title: this.behandeling.onderwerp.get("titel"),
        createdOn: new Date(),
        updatedOn: new Date()
      });
      const draftDecisionFolder = yield this.store.findRecord(
        "editor-document-folder",
        "ae5feaed-7b70-4533-9417-10fbbc480a4c"
      );
      this.documentContainer = this.store.createRecord("document-container", {
        folder: draftDecisionFolder,
      });
      this.documentContainer.status=yield this.store.findRecord("concept", "7186547b61414095aa2a4affefdcca67"); //geagendeerd status
      this.documentContainer.currentVersion = this.document;
      this.behandeling.documentContainer = this.documentContainer;
      yield this.document.save();
      yield this.documentContainer.save();
      yield this.behandeling.save();
    }
  }
  @action
  async save(e) {
    e.stopPropagation();
    this.behandeling.openbaar = this.openbaar;
    const document = await this.saveEditorDocument.perform(this.document);
    this.document = document;
    await this.behandeling.save();
  }

  @action
  handleRdfaEditorInit(editor) {
    if (this.document.content) {
      editor.setHtmlContent(this.document.get("content"));
    }
    this.editor = editor;
  }

  @action
  toggleOpenbaar(e) {
    this.openbaar = e.target.checked;
  }

  @task
  *saveEditorDocument(editorDocument, newStatus, newFolder) {
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
    let status = newStatus ? newStatus : yield documentContainer.get("status");
    let folder = newFolder ? newFolder : yield documentContainer.get("folder");

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
      const bestuurseenheid = yield this.currentSession.get("group");
      documentContainer.set("publisher", bestuurseenheid);

      try {
        yield documentContainer.save();
      } catch (e) {
        console.error("Error saving the document container");
        console.error(e);
      }

      return documentToSave;
    } else {
      console.error(`The status or the folder didn't correctly load`);
    }
  }
}
