import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | ontwerpbesluiten-documents/demo-2', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:ontwerpbesluiten-documents/demo-2');
    assert.ok(route);
  });
});
