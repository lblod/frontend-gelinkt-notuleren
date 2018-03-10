import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    toggleExpand(besluit) {
      besluit.set('isExpanded', !besluit.get('isExpanded'));
    }
  }
});
