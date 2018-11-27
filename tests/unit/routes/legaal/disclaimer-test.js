import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | legaal/disclaimer', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:legaal/disclaimer');
    assert.ok(route);
  });
});
