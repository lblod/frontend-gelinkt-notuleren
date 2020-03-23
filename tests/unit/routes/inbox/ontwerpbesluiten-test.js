import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | inbox/ontwerpbesluiten', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:inbox/ontwerpbesluiten');
    assert.ok(route);
  });
});
