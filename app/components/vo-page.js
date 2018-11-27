import Component from '@ember/component';
import ENV from 'frontend-gelinkt-notuleren/config/environment';
export default Component.extend({
  init() {
    this._super(...arguments);
    this.set('header', ENV['vo-webuniversum']['header']);
    this.set('footer', ENV['vo-webuniversum']['footer']);
    this.set('showFooter', true);
  }
});
