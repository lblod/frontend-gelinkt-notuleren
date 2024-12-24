import { module, test } from 'qunit';
import { setupTest } from 'frontend-gelinkt-notuleren/tests/helpers';

module('Unit | Controller | regulatory-statements/copy', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let controller = this.owner.lookup('controller:regulatory-statements/copy');
    assert.ok(controller);
  });
});
