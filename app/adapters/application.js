import JSONAPIAdapter from '@ember-data/adapter/json-api';
const maxRetries = 5;
export default JSONAPIAdapter.extend({
  init() {
    this._super(...arguments);
  },
  ajax(url, method) {
    if (method === 'POST')
      return this._super(...arguments);

    const origAjax = this._super;
    const args = arguments;
    const sleep = (time) => new Promise( (resolve/*,reject*/) => setTimeout(() => resolve(true), time));
    const retry = (livesSpent) => {
      return new Promise((resolve, reject) => {
        sleep(250 * livesSpent).then(() => {
          if (livesSpent < maxRetries )
            origAjax.apply(this,args).then( (res) => resolve(res), () => retry(livesSpent + 1).then(
              (r) => resolve(r),
              (r) => reject(r)
            ));
          else
            origAjax.apply(this,args).then( (res) => resolve(res), (e) => reject(e));
        });
      });
    };
    return retry(0);
  }
});
