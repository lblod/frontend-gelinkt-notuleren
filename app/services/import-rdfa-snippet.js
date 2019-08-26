import Service from '@ember/service';
import { A } from '@ember/array';
import fetch from 'fetch';

export default Service.extend({
  snippets: null,

  init() {
    this._super(...arguments);
    this.set('snippets', A([]));
  },

  async downloadSnippet(params){
    let data = await fetch(params.source, { headers: { 'Accept': 'text/html' } });
    this.get('snippets').pushObject({source: params.source, target: params.source, data: await data.text()});
  },

  getLastDownloadedSnipped(){
    return this.get('snippets').lastObject;
  }
});
