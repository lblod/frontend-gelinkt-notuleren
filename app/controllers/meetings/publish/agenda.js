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
  * sign(type) {
  }

  @task
  * publish(type) {
  }

  @task
  * initializeAgendas() {
    const prePublish = yield this.createPrePublishedResource.perform();
    this.ontwerpAgenda = yield this.store.createRecord("agenda", {
      agendaType: "ontwerpagenda",
      zitting: this.model,
      agendapunten: this.model.behandeldeAgendapunten,
      renderedContent: prePublish
    });
    this.aanvullendeAgenda = yield this.store.createRecord("agenda", {
      agendaType: "aanvullendeagenda",
      zitting: this.model,
      agendapunten: this.model.behandeldeAgendapunten,
      renderedContent: prePublish

    });
    this.spoedeisendeAgenda = yield this.store.createRecord("agenda", {
      agendaType: "spoedeisendeagenda",
      zitting: this.model,
      agendapunten: this.model.behandeldeAgendapunten,
      renderedContent: prePublish
    });
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
    const response = yield this.ajax.post(
      `/signing/agenda/sign/${agendaType}/${id}`
    );
    console.log(response);
  }
}
