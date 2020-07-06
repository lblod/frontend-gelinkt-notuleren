import { schedule } from '@ember/runloop';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Component.extend({
  active: false,
  editorDocument: null,
  titlePlugin: service('rdfa-editor-document-title-plugin'),
  overruledTitle: '',
  generatedTitle: '',

  titleObserver: task(function *(){  // eslint-disable-line require-yield
    if (this.titlePlugin)
      this.set('generatedTitle', this.titlePlugin.title);
    if (this.overruledTitle && this.overruledTitle.length > 0 ) {
      this.set('editorDocument.title', this.overruledTitle);
    }
    else if (this.titlePlugin && this.titlePlugin.title.length > 0) {
      this.set('editorDocument.title', this.titlePlugin.title);
    }
    else {
      this.set('editorDocument.title', 'Naamloos document');
    }
  }).keepLatest(),

  didReceiveAttrs(){
    this._super(...arguments);
    if(this.editorDocument.title) {
      this.set('overruledTitle', this.editorDocument.title);
      this.set('generatedTitle', this.editorDocument.title);
    }

    if(this.titlePlugin)
      this.titlePlugin.addObserver('title', () => { return this.titleObserver.perform(); });
  },

  actions:{
    updateTitle(){
    },
    toggleActive(){
      this.set('active', !this.active);
      if (this.active)
        schedule('afterRender', () => this.$('input').focus());
      else {
        this.set('overruledTitle', this.editorDocument.title);
        const overruledTitle = this.overruledTitle.slice().trim();
        if(overruledTitle.length === 0) {
          if(this.generatedTitle.length > 0) {
            this.set('editorDocument.title', this.generatedTitle);
          } else {
            this.set('editorDocument.title', 'Naamloos document');
          }
        }
      }
    }
  }
});
