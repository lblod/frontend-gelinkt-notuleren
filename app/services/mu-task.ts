import Service from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import { type Option } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/option';

const TASK_ENDPOINT = '/publication-tasks';
export const TASK_STATUS_FAILURE =
  'http://lblod.data.gift/besluit-publicatie-melding-statuses/failure';
export const TASK_STATUS_CREATED =
  'http://lblod.data.gift/besluit-publicatie-melding-statuses/created';
export const TASK_STATUS_SUCCESS =
  'http://lblod.data.gift/besluit-publicatie-melding-statuses/success';
export const TASK_STATUS_RUNNING =
  'http://lblod.data.gift/besluit-publicatie-melding-statuses/ongoing';

type TaskBody = { data: { id: string; status: string } };

export default class MuTaskService extends Service {
  fetchMuTask(taskId: string) {
    // TODO do this with ember-data and mu-cl-resource
    return fetch(`${TASK_ENDPOINT}/${taskId}`);
  }

  waitForMuTaskTask = task(
    async (
      taskId: string,
      /** time to wait between each status poll */
      pollDelayMs: number = 1000,
      /** maximum time to wait before throwing */
      timeoutMs: number = 300000,
    ) => {
      let resp: Response;
      let jsonBody: TaskBody | undefined;
      let currentStatus: Option<string>;
      const startTime = Date.now();
      do {
        await timeout(pollDelayMs);
        resp = await this.fetchMuTask(taskId);
        if (resp.ok) {
          jsonBody = (await resp.json()) as TaskBody;
          currentStatus = jsonBody.data.status;
        } else {
          currentStatus = null;
        }
      } while (
        resp.ok &&
        (currentStatus === TASK_STATUS_RUNNING ||
          currentStatus === TASK_STATUS_CREATED) &&
        Date.now() - startTime < timeoutMs
      );

      if (!resp.ok) {
        const reason = await resp.text();
        throw new Error(reason);
      }

      if (currentStatus === TASK_STATUS_SUCCESS) {
        return jsonBody;
      } else if (currentStatus === TASK_STATUS_FAILURE) {
        throw new Error('Task failed.');
      } else if (currentStatus === TASK_STATUS_RUNNING) {
        throw new Error('Task timed out.');
      } else {
        throw new Error('Task in unexpected state');
      }
    },
  );

  async fetchTaskifiedEndpoint(
    url: Parameters<typeof fetch>[0],
    fetchOptions: Parameters<typeof fetch>[1],
  ) {
    const res = await fetch(url, fetchOptions);
    if (res.ok) {
      const json = (await res.json()) as TaskBody;
      return json.data.id;
    } else {
      throw new Error(await res.text());
    }
  }
}
