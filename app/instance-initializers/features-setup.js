import config from 'frontend-gelinkt-notuleren/config/environment';

export function initialize(appInstance) {
  const features = appInstance.lookup('service:features');
  const featureConfig = config.featureFlags || {};
  for (const key of Object.keys(featureConfig)) {
    const val = featureConfig[key];
    if (typeof val === 'string' || val instanceof String) {
      featureConfig[key] = val === 'true';
    }
  }
  features.setup(featureConfig);
}

export default {
  initialize,
};
