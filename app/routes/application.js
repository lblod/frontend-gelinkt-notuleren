import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

const featureFlagRegex = /^feature\[(.+)\]$/;

export default class ApplicationRoute extends Route {
  @service currentSession;
  @service features;

  beforeModel(transition) {
    this.updateFeatureFlags(transition.to.queryParams);

    return this.loadCurrentSession();
  }

  loadCurrentSession() {
    return this.currentSession.load().catch(() => this.session.invalidate());
  }

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
}
