import { tracked, TrackedMap} from 'tracked-built-ins';
import { Resource, } from 'ember-could-get-used-to-this';
export default class ParticipationMap extends Resource {
  /**
   * @callback DependencyConfig
   * @returns {[Mandataris[], Mandataris[], Mandataris[]]}
   */

  /**
   * @param {DependencyConfig} dependencies
   */
  // eslint-disable-next-line no-unused-vars
  constructor(dependencies) {
    super(...arguments);
  }

  /** @type {Map} */
  participationMap;

  get value() {
    return this.participationMap;
  }

  setup() {
    const map = new Map();
    const [participants, absentees, possibleParticipants] =
      this.args.positional;
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
