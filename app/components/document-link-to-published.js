import Component from '@ember/component';
import { computed } from '@ember/object';
import { task } from 'ember-concurrency';

export default Component.extend({
  tagName: 'span',
  setStatus: task(function *(){
    this.set('status', yield this.get('document.status'));
  }),

  linkText: computed('status', 'status.id', function() {
    const id = this.get('document.status.id');

    switch(id) {
      case "c272d47d756d4aeaa0be72081f1389c6":
        // ondertekende notulen gepubliceerd
        return "ga naar gepubliceerde en ondertekende notulen";
      case "cfd751588a6c453296de9f9c0dff2af4":
      case "5A8304E8C093B00009000010":
        // concept
        return null;
      case "627aec5d144c422bbd1077022c9b45d1":
        // agenda publiek
        return "ga naar gepubliceerde agenda";
      case "b763390a63d548bb977fb4804293084a":
        // notulen publiek
        return "ga naar publieke notulen";
    }
    return null;
  }),

  didInsertElement() {
    this._super(...arguments);
    this.setStatus.perform();
  }

});
