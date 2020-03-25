import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | ontwerpbesluiten-documents/demo-besluitsjabloon', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:ontwerpbesluiten-documents/demo-besluitsjabloon');
    assert.ok(route);
  });
});
