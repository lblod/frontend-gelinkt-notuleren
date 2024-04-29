const matchUserLocaleToSupportedLocale = (userLocale, supportedLocales) => {
  // Check if there is an exact match, e.g. nl-be === nl-be
  const supportedLocale = supportedLocales.find(
    (locale) => locale === userLocale,
  );

  if (supportedLocale) {
    return supportedLocale;
  }

  // Check if there is a match based on language, e.g. nl === nl-be
  const language = userLocale.split('-')[0];
  return supportedLocales.find((locale) =>
    locale.toLowerCase().startsWith(language.toLowerCase()),
  );
};

/**
 * Helper function to help pick supported locales for ember-intl.
 *
 * @param {string[]} userLocales - The user's locales, in order of preference,
 * possibly from `navigator.languages`
 * @param {string[]} supportedLocales - The locales the app supports, provided by `ember-intl`.
 * @param {string} defaultLocale - The default fallback locale.
 *
 * @returns {string[]} - The supported locales, in order of preference.
 **/
export function decentLocaleMatch(
  userLocales,
  supportedLocales,
  defaultLocale,
) {
  const supportedLocalesThatUserPrefers = userLocales.map((userLocale) =>
    matchUserLocaleToSupportedLocale(userLocale, supportedLocales),
  );

  const lowerCaseDefaultLocale = defaultLocale.toLowerCase();

  const deduplicatedSupportedLocales = new Set([
    ...supportedLocalesThatUserPrefers
      .map((locale) => locale && locale.toLowerCase())
      .filter((locale) => typeof locale === 'string'),
    lowerCaseDefaultLocale,
  ]);

  if (deduplicatedSupportedLocales.size < 1) {
    return [lowerCaseDefaultLocale];
  }

  return [...deduplicatedSupportedLocales];
}
