import RSVP from 'rsvp';
import { get } from '@ember/object';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import Component from '@ember/component';
import PromiseProxyObject from 'frontend-gelinkt-notuleren/utils/promise-proxy-object';

export default Component.extend({
  tagName: '',
  ajax: inject(),

  title: computed('agendaKind', function(){
    return `Voorvertoning ${this.agendaKind}`;
  }),
  status: computed('agenda.signedResources.length', 'agenda.publishedResource.createdOn', function(){
    let signedResourcesLength = get(this, 'agenda.signedResources.length');
    let isPublishedResource = get(this, 'agenda.publishedResource.id');
    if( isPublishedResource )
      return 'published';
    if( signedResourcesLength === 1 )
      return 'firstSignature';
    if( signedResourcesLength === 2 )
      return 'secondSignature';

    return 'concept';
  }),
  agendaKind: computed('agenda.kind', function() {
    const agenda = this.agenda;
    if (agenda) {
      if (agenda.kind == 'spoedeisendeagenda')
        return "spoedeisende agenda";
      if (agenda.kind == 'aanvullendeagenda')
        return "aanvullende agenda";
      if (agenda.kind == 'ontwerpagenda')
        return "ontwerpagenda";
      return agenda.kind;
    }
    return '';
  }),
  handtekeningStatus: computed('agenda.signedResources.length', function() {
    const signedResourcesLength = get(this, 'agenda.signedResources.length');
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
      return { label:'gepubliceerd', color: 'primary-blue' };
    if( this.status == 'firstSignature' )
      return { label: 'eerste handtekening', color: 'primary-yellow'};
    if( this.status == 'secondSignature' )
      return { label:'getekend', color: 'primary-yellow'};
    if( this.status == 'concept' )
      return { label: 'concept'};
    return 'concept';
  }),

  iconName: computed('status', function(){
    if( this.status == 'concept' )
      return 'vi-edit';
    if( this.status == 'firstSignature' || this.status == 'secondSignature' )
      return 'vi-clock';
    if( this.status == 'published' )
      return 'vi-news';

    return 'vi-edit';
  }),

  // This is an agenda object proxy onto which we dump a bunch of
  // contents necessary in the template.  Our construction works this
  // way to keep the template somewhat cleaner.
  mockAgenda: computed('agenda', 'currentEditorDocument', function(){
    if( this.agenda ) {
      // pick all info from the current agenda
      return PromiseProxyObject.create( {
        promise: RSVP.hash( {
          body: this.agenda.content,
          signedId: this.agenda.editorDocument.then( (ed) => ed.id )
        } )
      } );
    } else {
      // create an agenda with dumped contents and put it in a promise proxy
      return PromiseProxyObject.create({
        promise: RSVP.hash( {
          body: this.ajax
            .request(`/prepublish/agenda/${this.currentEditorDocument.id}`)
            .then( (response) => get(response, "data.attributes.content") ),
          signedId: get( this, 'currentEditorDocument.id' )
        })
      });
    }
  })
});
