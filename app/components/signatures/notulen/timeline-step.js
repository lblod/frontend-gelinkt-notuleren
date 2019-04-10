import RSVP from 'rsvp';
import { inject } from '@ember/service';
import EmberObject, { computed, get } from '@ember/object';
import { A } from '@ember/array';
import Component from '@ember/component';
import PromiseProxyObject from 'frontend-gelinkt-notuleren/utils/promise-proxy-object';

export default Component.extend({
  tagName: '',
  ajax: inject(),

  behandelingContainerId: 'behandeling-van-agendapunten-container',

  init() {
    this._super(...arguments);

    if (this.notulen && this.notulen.publicBehandelingen)
      this.set('publicBehandelingUris', this.notulen.publicBehandelingen);
    else
      this.set('publicBehandelingUris', A());
  },

  zittingWrapper: computed('mockNotulen.body', function() {
    if (this.mockNotulen.get('body')) {
      const div = document.createElement('div');
      div.innerHTML = this.mockNotulen.get('body');

      const bvapContainer = div.querySelector("[property='ext:behandelingVanAgendapuntenContainer']");
      bvapContainer.innerHTML = '';
      bvapContainer.id = this.behandelingContainerId;

      return div.innerHTML;
    } else {
      return null;
    }
  }),

  // This is an notulen object proxy onto which we dump a bunch of
  // contents necessary in the template.  Our construction works this
  // way to keep the template somewhat cleaner.
  mockNotulen: computed('notulen', 'currentEditorDocument', function(){
    if( this.notulen ) {
      // pick all info from the current notulen
      return PromiseProxyObject.create( {
        promise: RSVP.hash( {
          body: this.notulen.content,
          signedId: this.notulen.editorDocument.then( (ed) => ed.id )
        } )
      } );
    } else {
      // create an notulen with dumped contents and put it in a promise proxy
      return PromiseProxyObject.create({
        promise: RSVP.hash( {
          body: this.ajax
            .request(`/prepublish/notulen/${this.currentEditorDocument.id}`)
            .then( (response) => get(response, "data.attributes.content") ),
          signedId: get( this, 'currentEditorDocument.id' )
        })
      });
    }
  }),

  mockBehandelingen: computed('currentEditorDocument', function() {
    return PromiseProxyObject.create( {
      promise: this.ajax.request(`/prepublish/notulen/behandelingen/${this.currentEditorDocument.id}`).then(
        (response) => response.data.map( (record) => EmberObject.create(record.attributes) )
      )
    });
  }),

  updateNotulenPreview() {
    const div = document.createElement('div');
    div.innerHTML = this.mockNotulen.get('body');

    const behandelingNodes = div.querySelectorAll("[typeof='besluit:BehandelingVanAgendapunt']");
    behandelingNodes.forEach((node) => {
      const uri = node.attributes['resource'] && node.attributes['resource'].value;
      if (this.publicBehandelingUris.includes(uri)) {
        node.classList.remove('behandeling-preview--niet-publiek');
      } else {
        node.classList.add('behandeling-preview--niet-publiek');
      }
    });

    this.mockNotulen.set('body', div.innerHTML);
  },

  actions: {
    togglePublicationStatus(behandeling) {
      const uri = behandeling.behandeling;
      if (this.publicBehandelingUris.includes(uri))
        this.publicBehandelingUris.removeObject(uri);
      else
        this.publicBehandelingUris.pushObject(uri);
      this.updateNotulenPreview();
    }
  }
});
