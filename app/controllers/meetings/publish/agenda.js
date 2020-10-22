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
    this.ontwerpAgenda = yield this.initializeAgenda.perform("ontwerpagenda");
    this.aanvullendeAgenda = yield this.initializeAgenda.perform("aanvullendeagenda");
    this.spoedeisendeAgenda = yield this.initializeAgenda.perform("spoedeisendeagenda");
  }

  /**
   * @this {MeetingsPublishAgendaController}
   * @param {string} type
   * @return {Generator<*, void, *>}
   */
  @task
  * initializeAgenda(type) {
    const agendas = yield this.store.query("agenda",
      {
        'filter[zitting][:id:]': this.model.id,
        'filter[agenda-type]': type,
        include: "signed-resources,published-resource"
      }
    );
    if (agendas.length) {
      return agendas.firstObject;
    } else {
      const prePublish = yield this.createPrePublishedResource.perform();
      const rslt = yield this.store.createRecord("agenda", {
        agendaType: type,
        zitting: this.model,
        agendapunten: this.model.behandeldeAgendapunten,
        renderedContent: prePublish
      });
      return rslt;
    }


  }

  @task
  * createPrePublishedResource() {
    const id = this.model.id;
    const response = yield this.ajax.request(
      `/prepublish/agenda/${id}`
    );
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
