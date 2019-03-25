import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | documents/show/publish/uitreksels', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:documents/show/publish/uitreksels');
    assert.ok(route);
  });
});
