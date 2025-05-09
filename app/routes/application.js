import Route from '@ember/routing/route';
import { service } from '@ember/service';
import ENV from 'frontend-gelinkt-notuleren/config/environment';
import { decentLocaleMatch } from '../utils/intl';

const featureFlagRegex = /^feature\[(.+)\]$/;

const DEFAULT_LOCALE =
  !ENV.defaultLanguage || ENV.defaultLanguage.startsWith('{{')
    ? 'nl-BE'
    : ENV.defaultLanguage;

export default class ApplicationRoute extends Route {
  @service currentSession;
  @service features;
  @service session;
  @service plausible;
  @service intl;

  queryParams = {
    lang: {
      refreshModel: true,
    },
  };

  async beforeModel(transition) {
    this.updateFeatureFlags(transition.to.queryParams);
    await this.startAnalytics();
    await this.session.setup();
    return this.loadCurrentSession();
  }

  model(params) {
    const matchedLocales = decentLocaleMatch(
      params.lang ? [params.lang] : [],
      this.intl.locales,
      DEFAULT_LOCALE,
    );
    this.intl.setLocale(matchedLocales);
  }

  async startAnalytics() {
    const conf = ENV['ember-plausible'];
    // RegEx for matching some word in curly braces which are usually not part of a hostname
    const regex = /\{\{\w*\}\}/;
    // If config exists, application in production and config with proper data filled in
    if (
      conf &&
      ENV.environment === 'production' &&
      !regex.test(conf.domain) &&
      !regex.test(conf.apiHost)
    )
      return this.plausible.enable(conf);
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
        if (isEnabled) this.features.enable(featureFlag);
        else this.features.disable(featureFlag);
      }
    }
  }
}
