// The @types package does not include the helper...
declare module 'ember-feature-flags/helpers/feature-flag' {
  export default function featureFlag(flag: string): boolean;
}
