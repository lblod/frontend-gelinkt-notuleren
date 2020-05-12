import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | citaten/citaten-zoek', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:citaten/citaten-zoek');
    assert.ok(route);
  });
});
