import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  editorStatusClass: computed('status.id', function() {
    const id = this.get('status.id');
    switch(id) {
    case "7186547b61414095aa2a4affefdcca67":
      // ondertekende notulen gepubliceerd
      return "success";
    }
    return "action";
  })
});

// import { computed } from '@ember/object';
// import Component from '@ember/component';

// export default Component.extend({
//   tagName: '',
//   editorStatusClass: computed('ontwerp-besluit-status.id', function() {
//     const id = this.get('ontwerp-besluit-status.id');
//     switch(id) {
//       case "a1974d071e6a47b69b85313ebdcef9f7":
//         return "concept";
//       case "7186547b61414095aa2a4affefdcca67":
//         return "gepubliceerd"
//       case "ef8e4e331c31430bbdefcdb2bdfbcc06":
//         return "geagendeerd";
//     }
//     return "action";
//   })
// });
