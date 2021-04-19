import JSONAPIAdapter from '@ember-data/adapter/json-api';

export default class ApplicationAdapter extends JSONAPIAdapter {
  ajax(url, method) {
    if (method === 'POST')
      return super.ajax(...arguments);

    return retryOnError(super.ajax.bind(this), arguments);
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
      throw new Error(error);
    }
  }

}

function sleep(time) {
  return new Promise((resolve) => setTimeout(() => resolve(true), time));
}
