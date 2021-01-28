import { isEmpty } from '@ember/utils';
const statusEffectief = '21063a5b-912c-4241-841c-cc7fb3c73e75';
const statusWaarnemend = 'e1ca6edd-55e1-4288-92a5-53f4cf71946a';


/**
 * checks whether a mandatee can be a member of the meeting
 * this means the meeting date should be between the mandatee's start and end
 * the mandatee needs to have a "acting" (waarnemend) or "effective" (effectief) status
 */
export default function isValidMandateeForMeeting(mandatee, meeting) {
  const startOfMeeting = meeting.gestartOpTijdstip ? meeting.gestartOpTijdstip : meeting.geplandeStart;
  const hasValidStartDate = mandatee.start <= startOfMeeting;
  const hasValidEndDate = isEmpty(mandatee.einde) || mandatee.einde > startOfMeeting;
  const hasValidStatus = [statusEffectief, statusWaarnemend].includes(mandatee.get("status.id"));
  return hasValidStartDate && hasValidEndDate && hasValidStatus;
}
