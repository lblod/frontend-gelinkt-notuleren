import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  editorStatusClass: computed('status.id', function() {
    const id = this.get('status.id');
    switch(id) {
    case "c272d47d756d4aeaa0be72081f1389c6":
      // ondertekende notulen gepubliceerd
      return "pill--gray-dark";
    case "cfd751588a6c453296de9f9c0dff2af4":
    case "5A8304E8C093B00009000010":
      // concept
      return null;
    case "627aec5d144c422bbd1077022c9b45d1":
      // agenda publiek
      return "pill--primary-yellow";
    case "b763390a63d548bb977fb4804293084a":
      // besluitenlijst publiek
      return "pill--primary-yellow";
    }
    return null;
  })
});
