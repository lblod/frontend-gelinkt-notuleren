import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { task, restartableTask } from "ember-concurrency-decorators";

/** @typedef {import("./AgendaData").default} AgendaManagerData */

/**
 * @typedef {Object} Args
 * @property {AgendaManagerData} agendaData
 */

 /** @extends {Component<Args>} */
export default class AgendaManagerModalComponent extends Component {
  @service store;
  @tracked isEditing = false;
  @tracked currentlyEditing;
  @tracked isNew = false;
  @tracked zitting = this.args.zitting;
  @tracked showAfterAgendapuntOptions = false;
  @tracked selectedAfterAgendapunt;
  @tracked selectedLocation;
  @tracked afterAgendapuntOptions;
  @tracked error;
  toBeDeleted = [];
  geagendeerdStatus;
  conceptStatus;
  constructor(...args){
    super(...args);
    this.getStatus.perform();
  }

  @action
  save() {
    this.args.onSave();
    this.args.onClose();
  }


  @action
  async save() {
    if (this.isNew) {
      await this.createBehandeling(this.currentlyEditing);
      if(this.selectedDraft){
        const behandeling=await this.currentlyEditing.behandeling;
        behandeling.documentContainer=await this.selectedDraft;
        this.importedDrafts.pushObject(this.selectedDraft);
        this.selectedDraft = null;
      }
      this.isNew = false;
    }
    this.toggleEditing();
  }

  @restartableTask
  *saveAll() {
    // NOTE: huge try/catch because ember-concurrency error catching does not seem to catch promise rejections
    try {
      this.error = null;
      const agendapoints = this.zitting.agendapunten.filter((agendapoint) => ! agendapoint.get('isDeleted'));
      let previousAgendapoint = null;
      for(let i=0; i < agendapoints.length; i++) {
        const agendapoint = yield agendapoints.objectAt(i);
        agendapoint.position = i;
        agendapoint.vorigeAgendapunt = previousAgendapoint;
        agendapoint.zitting = yield this.zitting;

        const behandeling = yield agendapoint.behandeling;
        if(behandeling){
          const documentContainer = yield behandeling.get("documentContainer");
          if(documentContainer) {
            const status = yield documentContainer.get('status');
            if (status.get('id') != 'ef8e4e331c31430bbdefcdb2bdfbcc06') {
              // it's not published, so we set the status
              documentContainer.status=this.geagendeerdStatus;
            }
            yield documentContainer.save();
          }
          yield behandeling.save();
        }
        yield agendapoint.save();
        previousAgendapoint = agendapoint;
      }
      for(let i=0; i < this.toBeDeleted.length; i++){
        const agendapoint = yield this.toBeDeleted[i];
        const behandeling = yield agendapoint.behandeling;
        if(behandeling){
          const documentContainer = yield behandeling.documentContainer;
          if(documentContainer){
            documentContainer.status = this.conceptStatus;
            yield documentContainer.save();
          }
          yield behandeling.destroyRecord();
        }
        yield agendapoint.destroyRecord();
      }
    }
    catch(e) {
      this.error = e;
      throw e;
    }
    this.afterSave(this.zitting.agendapunten);
    this.args.cancel();
  }



  @action
  selectAfterAgendapunt(option) {
    this.selectedAfterAgendapunt = option;
    const apIndex = this.zitting.agendapunten.indexOf(this.currentlyEditing);
    const apAfterIndex = this.zitting.agendapunten.indexOf(option);

    if (apIndex > apAfterIndex) {
      this.zitting.agendapunten.objectAt(apIndex).position = apAfterIndex + 1;

      this.zitting.agendapunten.forEach((e, i) => {
        if (i > apAfterIndex && i < apIndex) {
          this.zitting.agendapunten.objectAt(i).position += 1;
        }
      });
    } else if (apIndex < apAfterIndex) {
      this.zitting.agendapunten.objectAt(apIndex).position = apAfterIndex;

      this.zitting.agendapunten.forEach((e, i) => {
        if (i <= apAfterIndex && i > apIndex) {
          this.zitting.agendapunten.objectAt(i).position -= 1;
        }
      });
    }

    this.zitting.agendapunten = this.zitting.agendapunten.sortBy("position");
  }

  @action
  async selectLocation(option) {
    this.selectedLocation = option;
    this.showAfterAgendapuntOptions = false;

    const index = this.zitting.agendapunten.indexOf(this.currentlyEditing);

    if (option.code == "start") {
      this.currentlyEditing.position = 0;

      this.zitting.agendapunten.forEach((e, i) => {
        if (i < index) {
          this.zitting.agendapunten.objectAt(i).position += 1;
        }
      });
    } else if (option.code == "end") {
      this.currentlyEditing.position = this.zitting.agendapunten.length - 1;

      this.zitting.agendapunten.forEach((e, i) => {
        if (i > index) {
          this.zitting.agendapunten.objectAt(i).position -= 1;
        }
      });
    } else if (option.code == "after") {
      this.showAfterAgendapuntOptions = true;
    }

    this.zitting.agendapunten = this.zitting.agendapunten.sortBy("position");
  }
  //edit screen importing
  @tracked
  importedDrafts=[];

  @tracked
  selectedDraft;

  @action
  async selectDraft(draft){
    this.selectedDraft=draft;
    this.currentlyEditing.titel = draft.get('currentVersion.title');
  }

}
