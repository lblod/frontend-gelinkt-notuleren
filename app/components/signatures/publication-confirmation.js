import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: '',

  currentSession: service(),
  name: null,
  mockDocument: null,
  confirm: null,
  cancel: null
});
