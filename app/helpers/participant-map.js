import { TrackedMap } from 'tracked-built-ins';
import { Resource } from 'ember-could-get-used-to-this';

/**
 * Maps the participant + absentee arrays into a more convenient tracked map of mandatee -> presence.
 * Can simply be used as a tracked map in the component or the template.
 */
export default class ParticipationMap extends Resource {
  /**
   * @callback DependencyConfig
   * @returns {{active: boolean, participants: Mandataris[], absentees: Mandataris[], possibleParticipants: Mandataris[]}}
   */

  /**
   * Backing state for the Resource's value
   * Apparently does not need to be tracked because of the resource's own
   * tracking context
   * @type {Map}
   * */
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
    const { active, participants, absentees, possibleParticipants } =
      this.args.named;

    // While it may be tempting to refactor this into setting the possible participants
    // all to true and then just setting absentees to false,
    // the logic is like this to better represent the data the user actually selected
    // even if that data would be technically impossible in the real world
    if (active) {
      if (participants && absentees) {
        participants.forEach((mandataris) => {
          map.set(mandataris, true);
        });

        absentees.forEach((mandataris) => {
          map.set(mandataris, false);
        });
      }

      possibleParticipants?.forEach((participant) => {
        if (!map.has(participant)) {
          map.set(participant, true);
        }
      });
    }
    this.participationMap = new TrackedMap(map);
  }
}
