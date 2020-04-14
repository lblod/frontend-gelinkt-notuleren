import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  currentSession: service(),
  features: service(),
  classNames: ["editor-chrome"],
  tagName: "nav",

  isMeetingMinutes: computed('typeDocument', function() {
    return this.documentType === "meetingMinutes";
  }),

  documentStatus: computed('documentContainer.status', function(){
    const status = this.documentContainer.get('status')
    console.log(status)
    return status
  }),

  isDraftDecisions: computed('typeDocument', function() {
    return this.documentType === "draftDecisions";
  })
});
