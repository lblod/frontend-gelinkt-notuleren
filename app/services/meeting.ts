import Service from '@ember/service';
import { unwrap } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/option';
import { sayDataFactory } from '@lblod/ember-rdfa-editor/core/say-data-factory';
import BehandelingVanAgendapunt from 'frontend-gelinkt-notuleren/models/behandeling-van-agendapunt';
import type MandatarisModel from 'frontend-gelinkt-notuleren/models/mandataris';
import ZittingModel from 'frontend-gelinkt-notuleren/models/zitting';
import { filterAsync } from 'frontend-gelinkt-notuleren/utils/filter';
import htmlToRdf from 'frontend-gelinkt-notuleren/utils/htmlToRdf';

export type MeetingValidationResult = {
  ok: boolean;
  general: MeetingInfoValidationResult;
  attendance: AttendanceValidationResult;
  treatments: Record<string, AgendapointTreatmentValidationResult>;
};

export type MeetingInfoValidationResult = {
  ok: boolean;
  scheduledStartDate: {
    filledIn: boolean;
  };
  startDate: {
    filledIn: boolean;
  };
  endDate: {
    filledIn: boolean;
  };
};

export type AgendapointTreatmentValidationResult = {
  ok: boolean;
  attendance: AttendanceValidationResult;
  decisionPresent: boolean;
};

export type AttendanceValidationResult = {
  ok: boolean;
  filledIn: boolean;
  unassignedMandatees: MandatarisModel[];
};

export default class MeetingService extends Service {
  async validateMeeting(
    meeting: ZittingModel,
    potentialParticipants: MandatarisModel[],
  ): Promise<MeetingValidationResult> {
    const meetingInfoValidationResult = this.validateMeetingInfo(meeting);
    const meetingAttendanceValidationResult = await this.validateAttendance(
      meeting,
      potentialParticipants,
    );
    const agendapoints = (await meeting.agendapunten).toSorted(
      (ap1, ap2) => (ap1.position ?? 0) - (ap2.position ?? 0),
    );
    const treatments = await Promise.all(
      agendapoints.map(async (ap) => unwrap(await ap.behandeling)),
    );
    const treatmentValidationResults = await Promise.all(
      treatments.map(async (treatment) => {
        return this.validateTreatment(treatment, potentialParticipants);
      }),
    );
    const treatmentsValidationResultsObject: Record<
      string,
      AgendapointTreatmentValidationResult
    > = {};
    for (let i = 0; i < treatments.length; i++) {
      const treatment = unwrap(treatments[i]);
      treatmentsValidationResultsObject[unwrap(treatment.id)] =
        treatmentValidationResults[i] as AgendapointTreatmentValidationResult;
    }
    const ok =
      meetingInfoValidationResult.ok &&
      meetingAttendanceValidationResult.ok &&
      treatmentValidationResults.every((result) => result.ok);
    return {
      ok,
      general: meetingInfoValidationResult,
      attendance: meetingAttendanceValidationResult,
      treatments: treatmentsValidationResultsObject,
    };
  }

  async validateTreatment(
    treatment: BehandelingVanAgendapunt,
    potentialParticipants: MandatarisModel[],
  ): Promise<AgendapointTreatmentValidationResult> {
    const treatmentAttendanceValidationResult = await this.validateAttendance(
      treatment,
      potentialParticipants,
    );
    const decisionValidationResult =
      await this.validateDecisionPresence(treatment);
    return {
      ok: treatmentAttendanceValidationResult.ok && decisionValidationResult,
      attendance: treatmentAttendanceValidationResult,
      decisionPresent: decisionValidationResult,
    };
  }

  validateMeetingInfo(meeting: ZittingModel): MeetingInfoValidationResult {
    const { geplandeStart, gestartOpTijdstip, geeindigdOpTijdstip } = meeting;
    return {
      ok:
        Boolean(geplandeStart) &&
        Boolean(gestartOpTijdstip) &&
        Boolean(geeindigdOpTijdstip),
      scheduledStartDate: {
        filledIn: Boolean(geplandeStart),
      },
      startDate: {
        filledIn: Boolean(gestartOpTijdstip),
      },
      endDate: {
        filledIn: Boolean(geeindigdOpTijdstip),
      },
    };
  }

  async validateAttendance(
    meetingOrTreatment: ZittingModel | BehandelingVanAgendapunt,
    potentialParticipants: MandatarisModel[],
  ): Promise<AttendanceValidationResult> {
    const filledIn = !(await isNotFilledIn(meetingOrTreatment));
    const unassignedMandatees = await filterAsync(
      potentialParticipants,
      (part) => isNotAssignedTo(part, meetingOrTreatment),
    );
    const ok = filledIn && unassignedMandatees.length === 0;
    return {
      ok,
      filledIn,
      unassignedMandatees,
    };
  }
  async validateDecisionPresence(
    treatment: BehandelingVanAgendapunt,
  ): Promise<boolean> {
    const documentContainer = await treatment.documentContainer;
    if (!documentContainer) return false;
    const document = await documentContainer.currentVersion;
    if (!document || !document.content) return false;
    const triples = await htmlToRdf(document.content);
    const matches = triples.match(
      undefined,
      sayDataFactory.namedNode(
        'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
      ),
      sayDataFactory.namedNode('http://data.vlaanderen.be/ns/besluit#Besluit'),
    );
    return matches.size > 0;
  }
}

const getAttendanceInfo = async (
  meetingOrTreatment: ZittingModel | BehandelingVanAgendapunt,
) => {
  let attendees: MandatarisModel[];
  let absentees: MandatarisModel[];
  if (meetingOrTreatment instanceof ZittingModel) {
    attendees = await meetingOrTreatment.aanwezigenBijStart;
    absentees = await meetingOrTreatment.afwezigenBijStart;
  } else {
    attendees = await meetingOrTreatment.aanwezigen;
    absentees = await meetingOrTreatment.afwezigen;
  }
  return {
    attendees,
    absentees,
  };
};

const isNotFilledIn = async (
  meetingOrTreatment: ZittingModel | BehandelingVanAgendapunt,
) => {
  const { attendees } = await getAttendanceInfo(meetingOrTreatment);
  return attendees.length === 0;
};

const isNotAssignedTo = async (
  mandatee: MandatarisModel,
  meetingOrTreatment: ZittingModel | BehandelingVanAgendapunt,
) => {
  const { attendees, absentees } = await getAttendanceInfo(meetingOrTreatment);
  return (
    !attendees.map((attendee) => attendee.id).includes(mandatee.id) &&
    !absentees.map((absentee) => absentee.id).includes(mandatee.id)
  );
};
