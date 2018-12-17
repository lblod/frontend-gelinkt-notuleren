import Component from '@ember/component';
import { computed } from '@ember/object';
import { task } from 'ember-concurrency';
import { getOwner } from '@ember/application';
import { inject as service } from '@ember/service';

export default Component.extend({
  currentSession: service(),

  tagName: 'span',
  setProperties: task(function *(){
    const bestuurseenheid = yield this.get('currentSession.group');
    const classificatieLabel = (yield bestuurseenheid.get('classificatie')).label;
    const bestuurseenheidNaam = bestuurseenheid.naam;
    const config = getOwner(this).resolveRegistration('config:environment');
    const baseHost = (config.publicatie || {}).baseUrl;
    this.set('baseUrl', `${baseHost.replace(/\/$/, "")}/${bestuurseenheidNaam}/${classificatieLabel}`);
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
    this.setProperties.perform();
  },

  actions: {
    goToPublication(link){
      window.open(link, '_blank');
    }

  }

});
