import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | imported-documents/show', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:imported-documents/show');
    assert.ok(route);
  });
});
