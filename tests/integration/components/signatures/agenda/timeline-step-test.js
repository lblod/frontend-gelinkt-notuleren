import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | signatures/agenda-manager/timeline-step', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{signatures/agenda/timeline-step}}`);

    assert.dom(this.element).hasText('');

    // Template block usage:
    await render(hbs`
      {{#signatures/agenda/timeline-step}}
        template block text
      {{/signatures/agenda/timeline-step}}
    `);

    assert.dom(this.element).hasText('template block text');
  });
});
