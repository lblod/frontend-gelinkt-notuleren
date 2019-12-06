import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  currentSession: service(),
  features: service(),
  classNames: ["editor-chrome"],
  tagName: "nav"
});
