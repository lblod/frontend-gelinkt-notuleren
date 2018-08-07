import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | editor status pill', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`{{editor-status-pill}}`);

    assert.dom('*').hasText('');

    // Template block usage:
    await render(hbs`
      {{#editor-status-pill}}
        template block text
      {{/editor-status-pill}}
    `);

    assert.dom('*').hasText('template block text');
  });
});
