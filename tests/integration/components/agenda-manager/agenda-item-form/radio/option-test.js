import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | agenda-manager/agenda-item-form/radio/option', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<AgendaManager::AgendaItemForm::Radio::Option />`);

    assert.equal(this.element.textContent.trim(), '');

    // Template block usage:
    await render(hbs`
      <AgendaManager::AgendaItemForm::Radio::Option>
        template block text
      </AgendaManager::AgendaItemForm::Radio::Option>
    `);

    assert.equal(this.element.textContent.trim(), 'template block text');
  });
});
