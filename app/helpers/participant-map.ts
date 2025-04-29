import { resource } from 'ember-resources';
import { ParticipationStatus } from 'frontend-gelinkt-notuleren/components/participation-list/mandatarissen-table';
import MandatarisModel from 'frontend-gelinkt-notuleren/models/mandataris';
import { TrackedMap } from 'tracked-built-ins';

type ParticipationMapArgs = () => {
  active: boolean;
  participants?: MandatarisModel[];
  absentees?: MandatarisModel[];
  unassignedMandatees?: MandatarisModel[];
  possibleParticipants?: MandatarisModel[];
};
export default function ParticipationMap(args: ParticipationMapArgs) {
  return resource(() => {
    const {
      active,
      participants,
      absentees,
      unassignedMandatees,
      possibleParticipants,
    } = args();
    const map = new Map<MandatarisModel, ParticipationStatus>();
    if (active) {
      participants?.forEach((mandataris) => {
        map.set(mandataris, ParticipationStatus.Attending);
      });

      absentees?.forEach((mandataris) => {
        map.set(mandataris, ParticipationStatus.Absent);
      });

      unassignedMandatees?.forEach((mandataris) => {
        map.set(mandataris, ParticipationStatus.NoMandate);
      });

      possibleParticipants?.forEach((participant) => {
        if (!map.has(participant)) {
          map.set(participant, ParticipationStatus.Attending);
        }
      });
    }
    return new TrackedMap(map);
  });
}
