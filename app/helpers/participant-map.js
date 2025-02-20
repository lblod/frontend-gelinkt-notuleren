import { resource } from 'ember-resources';
import { TrackedMap } from 'tracked-built-ins';

export default function ParticipationMap(args) {
  return resource(() => {
    const { active, participants, absentees, possibleParticipants } = args();
    const map = new Map();
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
    return new TrackedMap(map);
  });
}
