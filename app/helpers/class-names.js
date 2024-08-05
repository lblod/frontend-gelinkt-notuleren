// Adapted from https://github.com/appuniversum/ember-appuniversum/blob/c7102fee465092eaba76bd3df1e4a7e971fe25cf/addon/private/helpers/class-names.ts
export default function classNames(...classNames) {
  return classNames.filter(Boolean).join(' ');
}
