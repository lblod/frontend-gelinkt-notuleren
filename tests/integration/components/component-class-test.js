import { module, test } from 'qunit';
import { setupRenderingTest } from 'frontend-gelinkt-notuleren/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | component-class', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<ComponentClass />`);

    assert.dom(this.element).hasText('');

    // Template block usage:
    await render(hbs`
      <ComponentClass>
        template block text
      </ComponentClass>
    `);

    assert.dom(this.element).hasText('template block text');
  });
});
