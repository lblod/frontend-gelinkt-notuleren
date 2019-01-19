import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  
  search: task(function *(searchData) {
    yield timeout(300);
    let queryParams = {
      'filter': searchData.trim(),
      page: { size: 100 }
    };
    let status = yield this.store.query('editor-document-status', queryParams);
    return status;
  }),

  actions: {
    select(status){
      this.document.set('status', status);
    }
  }
});
