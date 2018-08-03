import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | published/zitting', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:published/zitting');
    assert.ok(route);
  });
});
