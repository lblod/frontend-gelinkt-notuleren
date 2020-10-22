import Component from "@glimmer/component";
/** @typedef {import("../../../models/agenda").default} Agenda */

/**
 * @typedef {Object} Args
 * @property {string} name Name of the resource to sign/publish (e.g. 'ontwerpagenda', 'aanvullende agenda', ...
 * @property {Agenda} agenda Versioned agenda to be signed/published
 * @property {string} step Name of the current selected step
 * @property {Function} signing Function to trigger the signing of the agenda
 * @property {Function} publish Function to trigger the publication of the agenda
 */

/**
 * @extends {Component<Args>}
 */
export default class SignaturesAgendaTimelineStep extends Component {
  get mockAgenda() {
    return {
      body: this.args.agenda.renderedContent,
      signedId: this.args.agenda.zitting.get('id')
    };
  }
}
