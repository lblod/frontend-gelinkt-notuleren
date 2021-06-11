import { TrackedMap } from 'tracked-built-ins';
import { Resource } from 'ember-could-get-used-to-this';

/**
 * Maps the participant + absentee arrays into a more convenient tracked map of mandatee -> presence.
 * Can simply be used as a tracked map in the component or the template.
 */
export default class ParticipationMap extends Resource {
  /**
   * @callback DependencyConfig
   * @returns {{participants: Mandataris[], absentees: Mandataris[], possibleParticipants: Mandataris[]}}
   */

  /** @type {Map} */
  participationMap;

  /**
   * @param {DependencyConfig} dependencies
   */
  // eslint-disable-next-line no-unused-vars
  constructor(dependencies) {
    super(...arguments);
  }

  get value() {
    return this.participationMap;
  }

  setup() {
    // -- VERY IMPORTANT --
    // we create a new UNTRACKED map here, and only at the end do we convert it
    // to a tracked one. Why? Because Resource lifecycle methods run in a tracking
    // context, so they will rerun when you read a tracked value and then change it
    // (in this case, the map.has before the map.set) which basically makes this map
    // recalculate everytime the map changes, which is not what we want
    // more info about this footgun here:
    // https://github.com/pzuraq/ember-could-get-used-to-this/pull/37#issuecomment-814157755
    const map = new Map();
    const { participants, absentees, possibleParticipants } = this.args.named;
    if (participants && absentees && possibleParticipants) {
      if (participants.length) {
        participants.forEach((mandataris) => {
          map.set(mandataris, true);
        });
      }

      if (absentees.length) {
        absentees.forEach((mandataris) => {
          map.set(mandataris, false);
        });
      }

      possibleParticipants.forEach((participant) => {
        if (!map.has(participant)) {
          map.set(participant, true);
        }
      });
    }
    this.participationMap = new TrackedMap(map);
  }
}
