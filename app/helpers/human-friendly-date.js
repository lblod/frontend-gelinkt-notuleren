import formatRelative from 'date-fns/formatRelative';
import locales from 'date-fns/locale';

function getDateFnsLocale(locale) {
  return locales[locale] ?? locales[locale.substring(0, 2)];
}

export default function humanFriendlyDate(date, { locale = 'nl-BE' } = {}) {
  if (!(date instanceof Date)) return '';
  try {
    return formatRelative(date, new Date(), {
      locale: getDateFnsLocale(locale),
    });
  } catch (e) {
    console.error(e);
    return '';
  }
}
