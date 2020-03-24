import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | imported-documents/publish', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:imported-documents/publish');
    assert.ok(route);
  });
});
