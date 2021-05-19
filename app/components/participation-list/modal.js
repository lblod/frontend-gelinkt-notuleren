import Component from '@glimmer/component';
import { action } from "@ember/object";
import { tracked } from 'tracked-built-ins';
import { inject as service } from '@ember/service';

/** @typedef {import("../../models/mandataris").default} Mandataris */
/** @typedef {import("../../models/bestuursorgaan").default} BestuursOrgaan */

/** @callback onSave
 * @param {Object} info
 */

/**
 * @typedef {Object} Args
 * @property {Mandataris} voorzitter
 * @property {Mandataris} secretaris
 * @property {boolean} show
 * @property {Function} togglePopup
 * @property {onSave} onSave
 * @property {BestuursOrgaan} bestuursOrgaan
 * @property {Array<Mandataris>} aanwezigenBijStart
 * @property {Array<Mandataris>} afwezigenBijStart
 * @property {Array<Mandataris>} possibleParticipants
 * @property {Zitting} meeting
 */

 /** @extends {Component<Args>} */
export default class ParticipationListModalComponent extends Component {
  @tracked voorzitter;
  @tracked mandataris;
  @tracked secretaris;
  @service store;
  selectedMandatees = new Map();

  constructor() {
    super(...arguments);
    this.voorzitter = this.args.voorzitter;
    this.secretaris = this.args.secretaris;
    this.generateSelected();
  }

  @action
  togglePopup(e) {
    if(e) {
      e.preventDefault();
    }
    this.args.togglePopup(e);
  }
  @action
  selectVoorzitter(value){
    this.voorzitter = value;
  }
  @action
  selectSecretaris(value){
    this.secretaris = value;
  }

  @action
  insert(e){
    e.preventDefault();
    const {participants, absentees} = this.collectParticipantsAndAbsentees();
    const info = {
      voorzitter: this.voorzitter,
      secretaris: this.secretaris,
      aanwezigenBijStart: participants,
      afwezigenBijStart: absentees
    };
    this.args.onSave(info);
    this.args.togglePopup(e);
  }

   /**
    * Convert from the two lists into a map which holds participation per mandatee
    */
   generateSelected() {
     const {aanwezigenBijStart, afwezigenBijStart, possibleParticipants} = this.args;


     if (aanwezigenBijStart && aanwezigenBijStart.length) {
       aanwezigenBijStart.forEach((mandataris) => {
         this.selectedMandatees.set(mandataris, true);
       });
     }


     if (afwezigenBijStart && afwezigenBijStart.length) {
       afwezigenBijStart.forEach((mandataris) => {
         this.selectedMandatees.set(mandataris, false);
       });
     }

     possibleParticipants.forEach((participant) => {
       if(!this.selectedMandatees.has(participant)) {
        this.selectedMandatees.set(participant, true);
       }
     });
   }

   /**
    * Convert from the map back to two lists
    * @return {{absentees: [], participants: []}}
    */
   collectParticipantsAndAbsentees() {
     const participants = [];
     const absentees = [];
     for (const [mandatee, participates] of this.selectedMandatees.entries()) {
       if(participates) {
         participants.push(mandatee);
       } else {
         absentees.push(mandatee);
       }

     }

     return {participants, absentees};
   }

   /**
    * Toggle the participation of a single mandataris
    * @param {Mandataris} mandataris
    * @param {boolean} selected
    */
   @action
   toggleParticipation(mandataris, selected) {
     this.selectedMandatees.set(mandataris, selected);
   }
}
