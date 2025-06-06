import formatRelative from 'date-fns/formatRelative';
import format from 'date-fns/format';
import locales from 'date-fns/locale';
import { helper } from '@ember/component/helper';
import type { Locale } from 'date-fns';
import type { Option } from '@lblod/ember-rdfa-editor/utils/_private/option';

function getDateFnsLocale(locale: string) {
  // @ts-expect-error TS doesn't handle these string literal indices well, so returns any
  return (locales[locale] ?? locales[locale.substring(0, 2)]) as
    | Locale
    | undefined;
}

function humanFriendlyDate(
  [date]: [Option<Date>],
  {
    locale = 'nl-BE',
    alwaysShowTime = true,
  }: { locale: string | undefined; alwaysShowTime?: boolean },
) {
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
