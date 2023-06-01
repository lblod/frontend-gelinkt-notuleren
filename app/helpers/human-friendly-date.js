import formatRelative from 'date-fns/formatRelative';
import format from 'date-fns/format';
import locales from 'date-fns/locale';
import { helper } from '@ember/component/helper';

function getDateFnsLocale(locale) {
  return locales[locale] ?? locales[locale.substring(0, 2)];
}

function humanFriendlyDate(
  [date],
  { locale = 'nl-BE', alwaysShowTime = true } = {}
) {
  console.log('LOCALE: ', locale);
  if (!(date instanceof Date)) return '';
  try {
    let relativeDate = formatRelative(date, new Date(), {
      locale: getDateFnsLocale(locale),
    });
    if (alwaysShowTime && !relativeDate.includes(':')) {
      relativeDate +=
        ' ' +
        format(date, 'p', {
          locale: getDateFnsLocale(locale),
        });
    }
    return relativeDate;
  } catch (e) {
    console.error(e);
    return '';
  }
}

export default helper(humanFriendlyDate);