import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | inbox/draft-decisions', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let controller = this.owner.lookup('controller:inbox/draft-decisions');
    assert.ok(controller);
  });
});
