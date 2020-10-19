import Controller from "@ember/controller";
import {inject as service} from "@ember/service";
import {task} from "ember-concurrency-decorators";
import {tracked} from "@glimmer/tracking";
/** @typedef {import("../../../models/agenda").default} Agenda */
/** @typedef {import("../../../models/zitting").default} Zitting */


/**
 * @extends {Controller}
 * @property {Zitting} model
 */
export default class MeetingsPublishAgendaController extends Controller {
  @service ajax;

  /** @type {string} */
  @tracked
  content;

  /** @type {Agenda} */
  @tracked
  ontwerpAgenda;

  /** @type {Agenda} */
  @tracked
  aanvullendeAgenda;

  /** @type {Agenda} */
  @tracked
  spoedeisendeAgenda;

  constructor() {
    super(...arguments);
  }

  initialize() {
    this.initializeAgendas.perform();
  }


  @task
  * initializeAgendas() {
    const ontwerp = yield this.store.query("agenda",
      {
        'filter[zitting][:id:]': this.model.id,
        'filter[agenda-type]': "ontwerpagenda",
        include: "signed-resources,published-resource"
      }
    );
    if (ontwerp.length) {
      this.ontwerpAgenda = ontwerp.firstObject;
    } else {
      const prePublish = yield this.createPrePublishedResource.perform();
      this.ontwerpAgenda = yield this.store.createRecord("agenda", {
        agendaType: "ontwerpagenda",
        zitting: this.model,
        agendapunten: this.model.behandeldeAgendapunten,
        renderedContent: prePublish
      });
    }
    const aanvullend = yield this.store.query("agenda",
      {
        'filter[zitting][:id:]': this.model.id,
        'filter[agenda-type]': "aanvullendeagenda",
        include: "signed-resources,published-resource"
      }
    );
    console.log("AANVULLENDE", aanvullend);
    if (aanvullend.length) {
      this.aanvullendeAgenda = aanvullend.firstObject;
    } else {
      const prePublish = yield this.createPrePublishedResource.perform();
      this.aanvullendeAgenda = yield this.store.createRecord("agenda", {
        agendaType: "aanvullendeagenda",
        zitting: this.model,
        agendapunten: this.model.behandeldeAgendapunten,
        renderedContent: prePublish
      });
    }
    const spoedeisend = yield this.store.query("agenda",
      {
        'filter[zitting][:id:]': this.model.id,
        'filter[agenda-type]': "spoedeisendeagenda",
        include: "signed-resources,published-resource"
      }
    );
    console.log("SPOEDEISEND", spoedeisend);
    if (spoedeisend.length) {
      this.spoedeisendeAgenda = spoedeisend.firstObject();
    } else {
      const prePublish = yield this.createPrePublishedResource.perform();
      this.spoedeisendeAgenda = yield this.store.createRecord("agenda", {
        agendaType: "spoedeisendeagenda",
        zitting: this.model,
        agendapunten: this.model.behandeldeAgendapunten,
        renderedContent: prePublish
      });
    }
  }

  @task
  * createPrePublishedResource() {
    const id = this.model.id;
    const response = yield this.ajax.request(
      `/prepublish/agenda/${id}`
    );
    console.log(response);
    return response.data.attributes.content;
  }

  /**
   * @param {string} agendaType
   * @this {MeetingsPublishAgendaController}
   */
  @task
  * createSignedResource(agendaType) {

    const id = this.model.id;
    yield this.ajax.post(
      `/signing/agenda/sign/${agendaType}/${id}`
    );
    yield this.initializeAgendas.perform();
  }

  /**
   * @param {string} agendaType
   * @this {MeetingsPublishAgendaController}
   */
  @task
  * createPublishedResource(agendaType) {
    const id = this.model.id;
    yield this.ajax.post(
      `/signing/agenda/publish/${agendaType}/${id}`
    );
    yield this.initializeAgendas.perform();

  }
}
