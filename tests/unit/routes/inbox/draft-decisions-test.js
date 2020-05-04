import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | inbox/draft-decisions', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:inbox/draft-decisions');
    assert.ok(route);
  });
});
