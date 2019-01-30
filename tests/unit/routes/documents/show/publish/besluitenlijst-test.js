import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | documents/show/publish/besluitenlijst', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:documents/show/publish/besluitenlijst');
    assert.ok(route);
  });
});
