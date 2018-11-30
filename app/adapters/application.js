import DS from 'ember-data';
import { runInDebug } from '@ember/debug';
const maxRetries = 5;
export default DS.JSONAPIAdapter.extend({
  init() {
    this._super(...arguments);
  },
  async ajax(url, method) {
    if (method !== 'GET')
      return this._super(...arguments);

    const origAjax = this._super;
    const args = arguments;
    const sleep = async (time) => setTimeout(() => true, time);
    const retry = (livesRemaining) => {
      return new Promise( async (resolve, reject) => {
        await sleep(50);
        if (livesRemaining > 0 )
          origAjax.apply(this,args).then( (res) => resolve(res), () => retry(livesRemaining-1));
        else
          origAjax.apply(this,args).then( (res) => resolve(res), (e) => reject(e));
      });
    };
    return retry(maxRetries);
  }
});
