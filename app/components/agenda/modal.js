import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { set } from "@ember/object";
import { restartableTask } from "ember-concurrency-decorators";
import zitting from "../../models/zitting";
import RSVP from "rsvp";

export default class AgendaModalComponent extends Component {
  @service store;
  @tracked isEditing = false;
  @tracked currentlyEditing;
  @tracked isNew = false;
  @tracked agendapunten = this.args.agendapunten;
  @tracked zitting = this.args.zitting;
  @tracked showAfterAgendapuntOptions = false;
  @tracked selectedAfterAgendapunt;
  @tracked selectedLocation;
  @tracked afterAgendapuntOptions;
  @tracked error;
  toBeDeleted = [];

  get afterSave() {
    return this.args.afterSave || (() => {});
  }

  @action
  async cancel() {
    this.args.agendapunten.forEach((agendapunt) => {
      agendapunt.rollbackAttributes();
    });
    this.toBeDeleted.forEach((ap) => {
      this.zitting.agendapunten.pushObject(ap);
    });
    this.zitting.agendapunten = this.zitting.agendapunten.sortBy("position");
    this.args.cancel();
  }

  @action
  async createAgendapunt() {
    const agendapunt = this.store.createRecord("agendapunt");
    agendapunt.titel = "";
    agendapunt.beschrijving = "";
    agendapunt.geplandOpenbaar = true;
    agendapunt.position = this.zitting.agendapunten.length;
    this.zitting.agendapunten.pushObject(agendapunt);
    this.edit(agendapunt);
    this.isNew = true;
  }

  @action
  async edit(agendapunt) {
    this.afterAgendapuntOptions = this.zitting.agendapunten.filter((ap) => {
      return ap != agendapunt;
    });

    this.selectedLocation = null;
    this.selectedAfterAgendapunt = null;

    this.currentlyEditing = agendapunt;
    this.toggleEditing();
  }

  @action
  async delete() {
    this.zitting.agendapunten.removeObject(this.currentlyEditing);
    this.toBeDeleted.push(this.currentlyEditing);
    this.cancelEditing();
  }

  @action
  async toggleEditing() {
    this.isEditing = !this.isEditing;
  }

  @action
  async cancelEditing() {
    this.toggleEditing();
    if (this.isNew) {
      this.zitting.agendapunten.removeObject(this.currentlyEditing);
      this.toBeDeleted.push(this.currentlyEditing);
      this.isNew = false;
    } else {
      // this.currentlyEditing.rollbackAttributes();
    }
    this.zitting.agendapunten = this.zitting.agendapunten.sortBy("position");
    this.showAfterAgendapuntOptions = false;
  }

  @restartableTask
  *saveAll() {
    // NOTE: huge try/catch because ember-concurrency error catching does not seem to catch promise rejections
    try {
      this.error = null;
      yield this.zitting.agendapunten;
      let previousAgendapoint = null;
      for(let i=0; i < this.zitting.agendapunten.length; i++) {
        const agendapoint = yield this.zitting.agendapunten.objectAt(i);

        agendapoint.position = i;
        agendapoint.vorigeAgendapunt = previousAgendapoint;
        agendapoint.zitting = this.zitting;

        const behandeling = yield agendapoint.behandeling;
        if(behandeling){
          const documentContainer = yield behandeling.documentContainer
          if(documentContainer){
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
          const documentContainer = yield behandeling.documentContainer
          if(documentContainer){
            documentContainer.ontwerpBesluitStatus =
              yield this.store.findRecord('concept', 'a1974d071e6a47b69b85313ebdcef9f7'); //concept status
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
  async save() {
    if (this.isNew) {
      this.createBehandeling(this.currentlyEditing);
      if(this.selectedDraft){
        const behandeling=await this.currentlyEditing.behandeling;
        this.selectedDraft.ontwerpBesluitStatus=
          await this.store.findRecord('concept', '7186547b61414095aa2a4affefdcca67');//geagenderred status
        this.currentlyEditing.behandeling.set('documentContainer', this.selectedDraft);
        this.selectedDraft = null;
      }
      this.isNew = false;
    }
    this.showAfterAgendapuntOptions = false;
    this.toggleEditing();
  }
  /**
   * @param {import("../../models/agendapunt").default} agendapunt
   */
  @action
  async createBehandeling(agendapunt) {
    /** @type {import("../../models/behandeling-van-agendapunt").default)} */
    if(!agendapunt.behandeling.content){
      const behandeling = this.store.createRecord("behandeling-van-agendapunt");
      behandeling.openbaar = agendapunt.geplandOpenbaar;
      behandeling.onderwerp = agendapunt;
      const previous = await agendapunt.vorigeAgendapunt;
      behandeling.aanwezigen = this.args.zitting.aanwezigenBijStart;
      behandeling.voorzitter = this.args.zitting.voorzitter;
      behandeling.secretaris = this.args.zitting.secretaris;
    }
  }

  @action
  async sort() {
    this.zitting.agendapunten.forEach((agendapunt, index) => {
      agendapunt.position = index;
    });
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
  unsavedDrafts=[];

  @tracked
  selectedDraft

  @action
  async selectDraft(draft){
    this.selectedDraft=draft;
  }

}
