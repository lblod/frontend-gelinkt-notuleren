import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | mock-login', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:mock-login');
    assert.ok(route);
  });
});
