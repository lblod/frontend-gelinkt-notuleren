import { resource } from 'ember-resources';
import MandatarisModel from 'frontend-gelinkt-notuleren/models/mandataris';
import { TrackedMap } from 'tracked-built-ins';

type ParticipationMapArgs = () => {
  active: boolean;
  participants?: MandatarisModel[];
  absentees?: MandatarisModel[];
  possibleParticipants?: MandatarisModel[];
};
export default function ParticipationMap(args: ParticipationMapArgs) {
  return resource(() => {
    const { active, participants, absentees, possibleParticipants } = args();
    const map = new Map<MandatarisModel, boolean>();
    if (active) {
      participants?.forEach((mandataris) => {
        map.set(mandataris, true);
      });

      absentees?.forEach((mandataris) => {
        map.set(mandataris, false);
      });

      possibleParticipants?.forEach((participant) => {
        if (!map.has(participant)) {
          map.set(participant, true);
        }
      });
    }
    return new TrackedMap(map);
  });
}
