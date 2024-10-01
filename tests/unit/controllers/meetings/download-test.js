import { module, test } from 'qunit';
import { setupTest } from 'frontend-gelinkt-notuleren/tests/helpers';

module('Unit | Controller | meetings/download', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let controller = this.owner.lookup('controller:meetings/download');
    assert.ok(controller);
  });
});
