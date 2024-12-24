import { module, test } from 'qunit';
import { setupTest } from 'frontend-gelinkt-notuleren/tests/helpers';

module('Unit | Route | regulatory-statements/copy', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:regulatory-statements/copy');
    assert.ok(route);
  });
});
