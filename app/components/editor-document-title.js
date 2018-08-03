import { schedule } from '@ember/runloop';
import Component from '@ember/component';

export default Component.extend({
  active: false,
  editorDocument: null,
  actions:{
    toggleActive(){
      this.set('active', !this.active);

      if (this.active) {
        schedule('afterRender', () => this.$('input').focus());
      }
   }
  }
});
