import { get } from '@ember/object';
import { computed } from '@ember/object';
import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: '',
  currentSession: service(),
  showSigningModal: false,
  showPublishingModal: false,

  async init() {
    this._super(...arguments);
    this.set('bestuurseenheid', await this.currentSession.group);
  },

  title: computed('name', function(){
    return `Voorvertoning ${this.name}`;
  }),
  status: computed('document.signedResources.{length,createdOn}', 'document.publishedResource.id', function(){
    let signedResourcesLength = get(this, 'document.signedResources.length');
    let isPublishedResource = get(this, 'document.publishedResource.id');
    if( isPublishedResource )
      return 'published';
    if( signedResourcesLength === 1 )
      return 'firstSignature';
    if( signedResourcesLength === 2 )
      return 'secondSignature';

    return 'concept';
  }),
  handtekeningStatus: computed('document.signedResources.length', function() {
    const signedResourcesLength = get(this, 'document.signedResources.length');
    if( signedResourcesLength === 1 )
      return { label: 'Tweede handtekening vereist', color: 'primary-yellow'};
    if ( signedResourcesLength === 2 )
      return { label: 'Ondertekend', color: 'primary-blue'};
    return {label: 'Niet ondertekend'};
  }),

  voorVertoningStatus: computed('status', function() {
    if( this.status == 'published' )
      return { label: 'Publieke versie', color: 'primary-blue'};
    if (this.status == 'firstSignature' || this.status == 'secondSignature')
      return { label: 'Ondertekende versie', color: 'primary-yellow'};
    return { label: 'Meest recente versie'};
  }),

  algemeneStatus: computed('status', function(){
    if( this.status == 'published' )
      return { label:'Gepubliceerd', color: 'primary-blue' };
    if( this.status == 'firstSignature' )
      return { label: 'Eerste handtekening verkregen', color: 'primary-yellow'};
    if( this.status == 'secondSignature' )
      return { label:'Getekend', color: 'primary-yellow'};
    if( this.status == 'concept' )
      return { label: 'Concept'};
    return 'concept';
  }),

  iconName: computed('status', function(){
    if ( this.loading )
      return 'loader';
    if ( this.status == 'concept' )
      return 'vi-edit';
    if ( this.status == 'firstSignature' || this.status == 'secondSignature' )
      return 'vi-clock';
    if ( this.status == 'published' )
      return 'vi-news';

    return 'vi-edit';
  }),

  actions: {
    signDocument(signedId) {
      this.sign(signedId);
      this.set('showSigningModal', false);
    },

    publishDocument(signedId) {
      this.publish(signedId);
      this.set('showPublishingModal', false);
    }
  }
});
