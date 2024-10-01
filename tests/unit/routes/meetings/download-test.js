import { module, test } from 'qunit';
import { setupTest } from 'frontend-gelinkt-notuleren/tests/helpers';

module('Unit | Route | meetings/download', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:meetings/download');
    assert.ok(route);
  });
});
