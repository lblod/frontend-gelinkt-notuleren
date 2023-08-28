import JSONAPIAdapter from '@ember-data/adapter/json-api';

export default class ApplicationAdapter extends JSONAPIAdapter {
  ajax(url, method) {
    if (method === 'POST') return super.ajax(...arguments);

    return retryOnError(super.ajax.bind(this), arguments);
  }
  findHasMany(store, snapshot, url, relationship) {
    // This bit looks for a custom option key on a hasMany relationship on an ember data model
    // which looks like this for example:
    // `@hasMany('mandataris', { inverse: null, defaultPagination: 100 }) mandataris`
    // the pagination value is then used in the backend request for the relationship
    // data. This only affects the loading of async relationships and has no
    // effect on direct use of store.query.
    const customPageSize = relationship.meta?.options?.defaultPageSize;
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
}

async function retryOnError(ajax, ajaxArgs, retryCount = 0) {
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

function sleep(time) {
  return new Promise((resolve) => setTimeout(() => resolve(true), time));
}
