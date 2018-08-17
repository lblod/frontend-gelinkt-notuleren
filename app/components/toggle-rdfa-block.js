import Component from '@ember/component';

export default Component.extend({
  classNameBindings: ['showRdfaBlocks'],
  showRdfaBlocks: false,
  actions: {
    toggleRdfaBlocks(){
      this.toggleProperty('showRdfaBlocks');
    }
  }
});
