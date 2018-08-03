import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | published/zitting/agenda', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:published/zitting/agenda');
    assert.ok(route);
  });
});
