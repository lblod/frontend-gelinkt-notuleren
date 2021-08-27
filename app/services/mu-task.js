import Service from '@ember/service';
import { task, timeout } from 'ember-concurrency';

const TASK_ENDPOINT = "/publication-tasks";
export const TASK_STATUS_FAILURE =  "http://lblod.data.gift/besluit-publicatie-melding-statuses/failure";
export const TASK_STATUS_CREATED =  "http://lblod.data.gift/besluit-publicatie-melding-statuses/created";
export const TASK_STATUS_SUCCESS =  "http://lblod.data.gift/besluit-publicatie-melding-statuses/success";
export const TASK_STATUS_RUNNING = "http://lblod.data.gift/besluit-publicatie-melding-statuses/ongoing";

export default class MuTaskService extends Service {

  fetchMuTask(taskId) {
    // TODO do this with ember-data and mu-cl-resource
    return fetch(`${TASK_ENDPOINT}/${taskId}`);
  }

  /**
   * @param {string} taskId
   * @param {number} [pollDelayMs] time to wait between each status poll
   * @param {number} [timeoutMs] maximum time to wait before throwing
   * */
  @task
  * waitForMuTaskTask(taskId, pollDelayMs = 1000, timeoutMs = 300000) {
    let resp;
    let currentStatus
    const startTime = Date.now();
    do {
      yield timeout(pollDelayMs);
      resp = yield this.fetchMuTask(taskId);
      if(resp.ok) {
        currentStatus = (yield resp.json()).data.status;
      } else {
        currentStatus = null;
      }
    } while(resp.ok
            && (currentStatus === TASK_STATUS_RUNNING || currentStatus === TASK_STATUS_CREATED)
            && Date.now() - startTime < timeoutMs);

    if(!resp.ok) {
      const reason = yield resp.text();
      throw new Error(reason);
    }

    if(currentStatus === TASK_STATUS_SUCCESS) {
      return task;
    } else if(currentStatus === TASK_STATUS_FAILURE) {
      throw new Error("Task failed.")
    } else if (currentStatus === TASK_STATUS_RUNNING) {
      throw new Error("Task timed out.");
    } else {
      throw new Error("Task in unexpected state");
    }
  }

  async fetchTaskifiedEndpoint(url, fetchOptions) {
    const res = await fetch(url, fetchOptions);
    if (res.ok) {
      const json = await res.json();
      return json.data.id;
    } else {
      throw new Error(await res.text());
    }

  }
}
