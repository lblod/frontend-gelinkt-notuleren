import { module, test } from 'qunit';

import { setupTest } from 'frontend-gelinkt-notuleren/tests/helpers';

module('Unit | Transform | string array', function (hooks) {
  setupTest(hooks);

  test.each(
    'it converts a simple array to a string and back',
    [
      {
        array: ['nl-NL', 'nl', 'en-US', 'en'],
      },
      {
        array: ['one","test","two', "'another'"],
      },
    ],
    function (assert, { array }) {
      const transform = this.owner.lookup('transform:string-array');

      const string = transform.serialize(array);
      const deserial = transform.deserialize(string);

      assert.equal(typeof string, 'string');
      assert.deepEqual(deserial, array);
    },
  );

  test.each(
    'ignores invalid serialized strings',
    [
      {
        string: '""',
      },
      {
        string: '{}',
      },
      {
        string: '{"test":"test"}',
      },
    ],
    function (assert, { string }) {
      const transform = this.owner.lookup('transform:string-array');

      const deserial = transform.deserialize(string);

      assert.deepEqual(deserial, []);
    },
  );
});
