import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | citaten/citaten-voeg-in', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:citaten/citaten-voeg-in');
    assert.ok(route);
  });
});
