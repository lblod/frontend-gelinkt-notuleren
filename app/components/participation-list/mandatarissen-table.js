import Component from '@glimmer/component';

/**
 * @callback toggleParticipation
 * @param {Mandataris} mandataris
 * @param {boolean} participates
 */

/**
 * @typedef {Object} Args
 * @property {Map<Mandataris, boolean>} selectedMandatees
 * @property {Array<Mandataris>} possibleParticipants
 * @property {toggleParticipation} toggleParticipation
 */

/** @extends {Component<Args>} */
export default class ParticipationListMandatarissenTableComponent extends Component {}
