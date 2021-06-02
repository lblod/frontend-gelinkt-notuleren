import Component from "@glimmer/component";
import { PUBLISHED_STATUS_ID } from 'frontend-gelinkt-notuleren/utils/constants';
import { tracked } from "@glimmer/tracking";
import { task } from "ember-concurrency";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";

export default class BehandelingVanAgendapuntComponent extends Component {
  @service store;
  @service router;

  @tracked openbaar;
  @tracked document;
  @tracked documentContainer;
  @tracked behandeling;
  @tracked editor;
  @tracked aanwezigen = [];
  @tracked afwezigen = [];
  @tracked voorzitter;
  @tracked secretaris;
  @tracked published=false;

  constructor() {
    super(...arguments);
    this.openbaar = this.args.behandeling.openbaar;
    this.behandeling = this.args.behandeling;
    this.documentContainer = this.args.behandeling.documentContainer;
    this.fetchParticipants.perform();
    this.getStatus.perform();
  }
  get editable() {
    return !(this.published || this.args.readOnly);
  }
  @task
  *getStatus(){
    const container=yield this.documentContainer;
    if(container.isLoaded){
      const status=yield container.status;
      if(status.isLoaded){
        if(status.id==PUBLISHED_STATUS_ID){
          this.published=true;
        }
      }
    }
  }
  get hasParticipants() {
    return this.aanwezigen.length;
  }

  /**
   * @typedef {Object} ParticipantInfo
   * @property {Mandataris} voorzitter
   * @property {Mandataris} secretaris
   * @property {Mandataris[]} aanwezigenBijStart
   * @property {Mandataris[]} afwezigenBijStart
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
    this.behandeling.afwezigen = participants.afwezigenBijStart;
    this.aanwezigen = participants.aanwezigenBijStart;
    this.afwezigen = participants.afwezigenBijStart;
    await this.behandeling.save();
  }

  @task
  *fetchParticipants() {
    const participantQuery = {
      sort: 'is-bestuurlijke-alias-van.achternaam',
      'filter[aanwezig-bij-behandeling][:id:]': this.args.behandeling.get('id'),
      include: 'is-bestuurlijke-alias-van',
      page: { size: 100 } //arbitrary number, later we will make sure there is previous last. (also like this in the plugin)
    };
    const absenteeQuery = {
      sort: 'is-bestuurlijke-alias-van.achternaam',
      'filter[afwezig-bij-behandeling][:id:]': this.args.behandeling.get('id'),
      include: 'is-bestuurlijke-alias-van',
      page: { size: 100 } //arbitrary number, later we will make sure there is previous last. (also like this in the plugin)
    };
    const aanwezigen = yield this.store.query('mandataris', participantQuery);
    this.aanwezigen = aanwezigen;
    this.behandeling.aanwezigen = aanwezigen;
    const afwezigen = yield this.store.query('mandataris', absenteeQuery);
    this.afwezigen = afwezigen;
    this.behandeling.afwezigen = afwezigen;
    this.voorzitter = yield this.behandeling.voorzitter;
    this.secretaris = yield this.behandeling.secretaris;
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

  @action
  goToEdit() {
    this.router.transitionTo('meetings.edit.treatment', this.args.meeting.id, this.args.behandeling.id);
  }

}
