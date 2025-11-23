import JSONAPIAdapter from '@ember-data/adapter/json-api';
import type { AdapterPayload } from '@ember-data/legacy-compat';
import type { Snapshot } from '@ember-data/legacy-compat/legacy-network-handler/snapshot';
import type Store from '@ember-data/store';
import type { ModelSchema } from '@ember-data/store/types';
import { dasherize } from '@ember/-internals/string';
import type { HTTPMethod } from '@warp-drive/core-types/request';

export default class ApplicationAdapter extends JSONAPIAdapter {
  ajax(url: string, method: HTTPMethod, ...rest: unknown[]) {
    if (method === 'POST') return super.ajax(url, method, ...rest);

    //@ts-expect-error The old code passed through extra args, so we keep this behaviour to match it
    return retryOnError(super.ajax.bind(this), [url, method, ...rest]);
  }
  override findHasMany(
    store: Store,
    snapshot: Snapshot,
    url: string,
    relationship: Record<string, unknown>,
  ) {
    // This bit looks for a custom option key on a hasMany relationship on an ember data model
    // which looks like this for example:
    // `@hasMany('mandataris', { inverse: null, defaultPageSize: 100 }) mandataris`
    // the pagination value is then used in the backend request for the relationship
    // data. This only affects the loading of async relationships and has no
    // effect on direct use of store.query.
    //@ts-expect-error Could maybe fix this with better typing of `relationship`
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const customPageSize = relationship['meta']?.options?.defaultPageSize as
      | number
      | undefined;
    if (customPageSize) {
      return super.findHasMany(
        store,
        snapshot,
        `${url}?page[size]=${customPageSize}`,
        relationship,
      );
    }
    return super.findHasMany(store, snapshot, url, relationship);
  }

  // Copy fix for includes in queries from here: https://github.com/emberjs/data/issues/9588
  override query(
    store: Store,
    type: ModelSchema,
    query: Record<string, unknown>,
  ): Promise<AdapterPayload> {
    if (query) {
      const { include } = query;
      const normalizedInclude = Array.isArray(include)
        ? include.map(dasherize).join(',')
        : include;

      if (normalizedInclude) {
        query['include'] = normalizedInclude;
      }
    }

    return super.query(store, type, query);
  }
}

async function retryOnError(
  ajax: JSONAPIAdapter['ajax'],
  ajaxArgs: Parameters<JSONAPIAdapter['ajax']>,
  retryCount = 0,
) {
  const MAX_RETRIES = 5;

  try {
    return await ajax(...ajaxArgs);
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      await sleep(250 * (retryCount + 1));
      return retryOnError(ajax, ajaxArgs, retryCount + 1);
    } else {
      throw error;
    }
  }
}

function sleep(time: number) {
  return new Promise((resolve) => setTimeout(() => resolve(true), time));
}
