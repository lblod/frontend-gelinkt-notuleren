// Initialize the intl service in a instance-initializer.
// Because we need to have access to a initialized service in order
// to set the locale
export function initialize(appInstance) {
  const intl = appInstance.lookup('service:intl');
  const userLocale = ( navigator.language || navigator.languages[0] )
  intl.setLocale([userLocale, 'nl-BE']);
}

export default {
  initialize
};
