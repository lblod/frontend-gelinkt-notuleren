import Component from '@ember/component';

export default Component.extend({
  tagName: 'li',
  classNames: 'step step--accordion js-accordion',
  classNameBindings: ['isOpen:js-accordion--open'],
  actions: {
    toggleAccordion(){
      this.toggleProperty("isOpen");
    }
  }
});
