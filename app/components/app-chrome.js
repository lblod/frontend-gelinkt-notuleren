import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  currentSession: service(),
  features: service(),
  tagName: "nav",

  isMeetingMinutes: computed('typeDocument', function() {
    return this.documentType === "meetingMinutes";
  }),

  documentStatus: computed('documentContainer.status', function(){
    const status = this.documentContainer.get('status');
    return status;
  }),

  isArchived: computed('documentStatus', function() {
    return this.documentStatus.get('id') === "cda8ec80-8508-40e2-9bbb-bee6d9536abb";
  }),

  isDraftDecisions: computed('typeDocument', function() {
    return this.documentType === "draftDecisions";
  })
});
