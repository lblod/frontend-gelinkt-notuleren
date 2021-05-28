import Controller from "@ember/controller";
import {task} from "ember-concurrency";
import {tracked} from "@glimmer/tracking";
import fetch from 'fetch';

/** @typedef {import("../../../models/agenda").default} Agenda */
/** @typedef {import("../../../models/zitting").default} Zitting */


/**
 * @extends {Controller}
 * @property {Zitting} model
 */
export default class MeetingsPublishAgendaController extends Controller {
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

  @task
  * reloadAgendas() {
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
    const response = yield fetch(`/prepublish/agenda/${id}`);
    const json = yield response.json();
    return json.data.attributes.content;
  }

  /**
   * @param {string} agendaType
   * @this {MeetingsPublishAgendaController}
   */
  @task
  * createSignedResource(agendaType) {

    const id = this.model.id;
    yield fetch(`/signing/agenda/sign/${agendaType}/${id}`, { method: 'POST'});
    yield this.reloadAgendas.perform();
  }

  /**
   * @param {string} agendaType
   * @this {MeetingsPublishAgendaController}
   */
  @task
  * createPublishedResource(agendaType) {
    const id = this.model.id;
    yield fetch(`/signing/agenda/publish/${agendaType}/${id}`, { method: 'POST'});
    yield this.reloadAgendas.perform();
  }
}
