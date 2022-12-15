import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import fetch from 'fetch';
import { inject as service } from '@ember/service';

/** @typedef {import("../../../models/agenda").default} Agenda */
/** @typedef {import("../../../models/zitting").default} Zitting */

// agenda kind uuid's as defined in the codelist
// mapping ontwerp to "gepland"
const KIND_GEPLAND_UUID = 'bdf68a65-ce15-42c8-ae1b-19eeb39e20d0';
const KIND_AANVULLENDE_UUID = 'b122db75-fd93-4f03-b57a-2a9269289782';
const KIND_SPOEDEISENDE_UUID = '8c143571-175c-4d13-acaa-9f471180a8c9';

const KIND_LABEL_TO_UUID_MAP = new Map(
  Object.entries({
    gepland: KIND_GEPLAND_UUID,
    aanvullend: KIND_AANVULLENDE_UUID,
    spoedeisend: KIND_SPOEDEISENDE_UUID,
  })
);

/**
 * @extends {Controller}
 * @property {Zitting} model
 */
export default class MeetingsPublishAgendaController extends Controller {
  @service store;

  kindGepland = KIND_GEPLAND_UUID;
  kindAanvullend = KIND_AANVULLENDE_UUID;
  kindSpoedeisend = KIND_SPOEDEISENDE_UUID;

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

  get meeting() {
    return this.model;
  }

  initializeAgendas = task(async () => {
    this.ontwerpAgenda = await this.initializeAgenda.perform('gepland');
    this.aanvullendeAgenda = await this.initializeAgenda.perform('aanvullend');
    this.spoedeisendeAgenda = await this.initializeAgenda.perform(
      'spoedeisend'
    );
  });

  reloadAgendas = task(async () => {
    this.ontwerpAgenda = await this.initializeAgenda.perform('gepland');
    this.aanvullendeAgenda = await this.initializeAgenda.perform('aanvullend');
    this.spoedeisendeAgenda = await this.initializeAgenda.perform(
      'spoedeisend'
    );
  });

  /**
   * @this {MeetingsPublishAgendaController}
   * @param {string} type
   */
  initializeAgenda = task(async (type) => {
    const agendas = await this.store.query('agenda', {
      'filter[zitting][:id:]': this.meeting.id,
      'filter[agenda-type]': type,
      include: 'signed-resources,published-resource',
    });
    if (agendas.length) {
      return agendas.firstObject;
    } else {
      const prePublish = await this.createPrePublishedResource.perform(
        KIND_LABEL_TO_UUID_MAP.get(type)
      );
      const rslt = await this.store.createRecord('agenda', {
        agendaType: type,
        zitting: this.model,
        agendapunten: this.model.behandeldeAgendapunten,
        renderedContent: prePublish,
      });
      return rslt;
    }
  });

  createPrePublishedResource = task(async (kindUuid) => {
    const id = this.meeting.id;
    const response = await fetch(`/prepublish/agenda/${kindUuid}/${id}`);
    const json = await response.json();
    return json.data.attributes.content;
  });

  /**
   * @param {string} agendaType
   * @this {MeetingsPublishAgendaController}
   */
  createSignedResource = task(async (kindUuid) => {
    const id = this.model.id;
    await fetch(`/signing/agenda/sign/${kindUuid}/${id}`, { method: 'POST' });
    await this.reloadAgendas.perform();
  });

  /**
   * @param {string} agendaType
   * @this {MeetingsPublishAgendaController}
   */
  createPublishedResource = task(async (kindUuid) => {
    const id = this.model.id;
    await fetch(`/signing/agenda/publish/${kindUuid}/${id}`, {
      method: 'POST',
    });
    await this.reloadAgendas.perform();
  });
}
