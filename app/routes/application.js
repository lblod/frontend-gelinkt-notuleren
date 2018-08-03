import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  moment: service(),
  beforeModel() {
    this.moment.setTimeZone('Europe/Brussels');
    this.moment.setLocale('nl');
  }
});
