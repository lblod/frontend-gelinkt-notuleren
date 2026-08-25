import { timeout } from 'ember-concurrency';

export interface TreatmentWarning {
  treatmentUri: string;
  documentContainerUri: string;
  decisionTitle: string;
  type: 'linkedDecision';
  decisionType: string;
}
export interface PrepublishJob {
  data: {
    attributes: { jobId: string };
    type: 'prepublish-jobs';
  };
}
export interface ImportedAgendaContent {
  data: {
    attributes: { content: string };
    type: 'imported-agenda-contents';
  };
}
export interface ImportedBesluitenContent {
  data: {
    attributes: {
      content: string;
      errors: string[];
    };
    type: 'imported-besluitenlijst-contents';
  };
}
export interface ImportedNotulenContent {
  data: {
    attributes: {
      content: string;
      errors: string[];
      warnings: TreatmentWarning[];
    };
    type: 'imported-notulen-contents';
  };
}
export interface NotulenFinalPreview {
  data: {
    type: 'notulen-final-previews';
    id: string;
    attributes: { html: string };
  };
  relationships: {
    meeting: {
      data: {
        id: string;
        type: 'meetings';
      };
    };
  };
}
export interface TreatmentPreview {
  content: string;
  errors: string[];
  warnings: TreatmentWarning[];
  behandeling: string;
  uuid: string;
}
/** Note: this lacks a `type` field, but since it's the only one that does, it's distinct */
export interface TreatmentPreviewData {
  data: {
    attributes: TreatmentPreview;
  };
}
type PrepublishResponse =
  | PrepublishJob
  | ImportedAgendaContent
  | ImportedBesluitenContent
  | ImportedNotulenContent
  | NotulenFinalPreview
  | TreatmentPreviewData[];

// It would be nice to do this with a lookup based on the url passed rather than having to specify
// the generic type of the return
export async function fetchWithJob<R extends PrepublishResponse>(
  url: string,
  options: RequestInit = {},
  pollingDelayMs: number = 1000,
  maxIterations: number = 600,
): Promise<R> {
  const job = await fetch(url, options);
  const jobData = (await job.json()) as PrepublishJob;
  const jobId = jobData.data.attributes.jobId;

  let resp: Response;
  do {
    await timeout(pollingDelayMs);
    resp = await fetch(`/prepublish/job-result/${jobId}`);
    maxIterations--;
    if (resp.status === 500) {
      pollingDelayMs *= 2;
    }
  } while ([404, 500].includes(resp.status) && maxIterations > 0);

  if (!resp.ok) {
    let errors: string | undefined;
    try {
      if (resp.status !== 500) {
        const json = (await resp.json()) as { errors: [] };
        if (json?.errors) {
          errors =
            // @ts-expect-error This seems to never happen but left in case there's some way
            (json.errors?.[0]?.title as string) || JSON.stringify(json.errors);
        }
      }
    } catch (err) {
      if (!resp.bodyUsed) {
        console.warn(
          'Error when handling prepublish job, attempting to read contained error',
          err,
        );
        // throwing body text
        errors = await resp.text();
        throw new Error(errors);
      } else {
        throw err;
      }
    }
    // throwing stringified json body
    throw new Error(errors);
  } else {
    return (await resp.json()) as R;
  }
}

export async function fetchTreatmentPreviews(meetingId: string) {
  return fetchWithJob<TreatmentPreviewData[]>(
    `/prepublish/behandelingen/${meetingId}`,
  );
}
