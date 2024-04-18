import { module, test } from 'qunit';

import { decentLocaleMatch } from 'frontend-gelinkt-notuleren/utils/intl';

const supportedLocales = ['en-us', 'nl-BE'];
const defaultLocale = 'nl-BE';

module('Unit | Utils | intl', function () {
  test.each(
    'decentLocaleMatch',
    [
      {
        userLocales: ['nl-NL', 'nl', 'en-US', 'en'],
        expectedResult: ['nl-be', 'en-us'],
      },
      {
        userLocales: ['nl-NL', 'nl'],
        expectedResult: ['nl-be'],
      },
      {
        userLocales: ['en-US', 'en', 'nl-NL', 'nl'],
        expectedResult: ['en-us', 'nl-be'],
      },
    ],
    (assert, { userLocales, expectedResult }) => {
      const result = decentLocaleMatch(
        userLocales,
        supportedLocales,
        defaultLocale,
      );

      assert.deepEqual(result, expectedResult);
    },
  );
});
