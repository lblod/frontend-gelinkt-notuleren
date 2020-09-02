import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | legaal/toegankelijkheidsverklaring', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:legaal/toegankelijkheidsverklaring');
    assert.ok(route);
  });
});
