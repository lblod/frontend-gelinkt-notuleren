import RSVP from 'rsvp';
import {inject as service} from '@ember/service';
import PromiseProxyObject from 'frontend-gelinkt-notuleren/utils/promise-proxy-object';
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
  @service ajax;

  // This is an agenda object proxy onto which we dump a bunch of
  // contents necessary in the template.  Our construction works this
  // way to keep the template somewhat cleaner.
  get mockAgenda() {
    return {
      body: this.args.agenda.renderedContent,
      signedId: this.args.agenda.zitting.get('id')
    };
    //   if (this.args.agenda.renderedContent) {
    //
    //     return PromiseProxyObject.create({
    //       promise: RSVP.hash({
    //         body: this.args.agenda.renderedContent,
    //         signedId: this.args.agenda.zitting.then((ed) => ed.id)
    //       })
    //     });
    //   } else {
    //     // create an agenda with dumped contents and put it in a promise proxy
    //     return PromiseProxyObject.create({
    //       promise: RSVP.hash({
    //         body: this.ajax
    //           .request(`/prepublish/agenda/${this.currentEditorDocument.id}`)
    //           .then((response) => get(response, "data.attributes.content")),
    //         signedId: get(this, 'currentEditorDocument.id')
    //       })
    //     });
    //   }
  }
}
