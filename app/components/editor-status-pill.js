import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  editorStatusClass: computed('status.id', function() {
    const id = this.get('status.id');
    switch(id) {
    case "ef8e4e331c31430bbdefcdb2bdfbcc06":
      // ondertekende notulen gepubliceerd
      return "success";
    }
    return "action";
  })
});
