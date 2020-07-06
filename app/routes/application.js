import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import ENV from 'frontend-gelinkt-notuleren/config/environment';

const featureFlagRegex = /^feature\[(.+)\]$/;

export default Route.extend(ApplicationRouteMixin, {
  moment: service(),
  currentSession: service(),
  features: service(),
  intl: service(),

  beforeModel(transition) {
    
    this.updateFeatureFlags(transition.to.queryParams);
    return this.loadCurrentSession();
  },

  sessionAuthenticated() {
    this._super(...arguments);
    this.loadCurrentSession();
  },

  sessionInvalidated() {
    const logoutUrl = ENV['torii']['providers']['acmidm-oauth2']['logoutUrl'];
    window.location.replace(logoutUrl);
  },

  loadCurrentSession() {
    return this.currentSession.load().catch(() => this.session.invalidate());
  },

  updateFeatureFlags(queryParams) {
    const keys = Object.keys(queryParams);

    for (let key of keys) {
      const match = featureFlagRegex.exec(key);
      if (match) {
        const featureFlag = match[1];
        const isEnabled = queryParams[key] == 'true';
        if (isEnabled)
          this.features.enable(featureFlag);
        else
          this.features.disable(featureFlag);
      }
    }
  }
});
