import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | vo-page', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{vo-page}}`);

    assert.dom(this.element).hasText('');

    // Template block usage:
    await render(hbs`
      {{#vo-page}}
        template block text
      {{/vo-page}}
    `);

    assert.dom(this.element).hasText('template block text');
  });
});
