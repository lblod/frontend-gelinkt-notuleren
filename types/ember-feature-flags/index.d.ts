declare module 'ember-feature-flags' {
  // These types taken from @types/ember-feature-flags, but copied here to avoid the dependency on
  // definitely typed Ember packages.

  import Service from '@ember/service';

  // https://github.com/kategengler/ember-feature-flags/blob/v6.0.0/addon/services/features.js#L5
  export default interface Features extends Service {
    setup(features: { [key: string]: boolean }): void;
    enable(feature: string): void;
    disable(feature: string): void;
    isEnabled(feature: string): boolean;
    readonly flags: string[];
  }
}
