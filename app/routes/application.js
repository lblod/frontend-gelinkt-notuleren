import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import ENV from 'frontend-gelinkt-notuleren/config/environment';

export default Route.extend(ApplicationRouteMixin, {
  moment: service(),
  currentSession: service(),
  beforeModel() {
    this.moment.setTimeZone('Europe/Brussels');
    this.moment.setLocale('nl');
    return this._loadCurrentSession();
  },

  sessionAuthenticated() {
    this._super(...arguments);
    this._loadCurrentSession();
  },

  sessionInvalidated() {
    const logoutUrl = ENV['torii']['providers']['acmidm-oauth2']['logoutUrl'];
    window.location.replace(logoutUrl);
  },

  _loadCurrentSession() {
    return this.get('currentSession').load().catch(() => this.get('session').invalidate());
  }
});
