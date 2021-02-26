import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | ember-data-sanity', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('nested model saving new relationship', async function(assert) {
    const store = this.owner.lookup('service:store');
    const documentContainer = store.createRecord("document-container");
    const behandeling = store.createRecord("behandeling-van-agendapunt");
    behandeling.documentContainer = documentContainer;

    assert.ok(documentContainer.isNew);
    assert.ok(behandeling.isNew);

    await behandeling.save();
    // ember-data does not recursively persist new relationships
    assert.ok(documentContainer.isNew);
    assert.notOk(behandeling.isNew);
  });

  test('nested model saving to relationship edits', async function(assert) {
    const store = this.owner.lookup('service:store');
    const agendaItem = store.createRecord("agendapunt");
    const treatment = store.createRecord("behandeling-van-agendapunt", {openbaar: false});
    agendaItem.behandeling = treatment;

    assert.ok(agendaItem.isNew);
    assert.ok(treatment.isNew);

    await treatment.save();
    await agendaItem.save();
    const treatmentId = treatment.get("id");

    assert.notOk(treatment.isNew);
    assert.notOk(agendaItem.isNew);
    assert.notOk(treatment.openbaar);

    // adjust a property of a relationship
    treatment.openbaar = true;
    assert.ok(treatment.openbaar);

    // only save the toplevel model
    await agendaItem.save();

    // empty the store so we can see what got persisted
    store.unloadAll();

    // fetch the relation ship again
    const treatmentAfterUnload = await store.findRecord("behandeling-van-agendapunt", treatmentId);

    // ember-data does not recursively save relationships!
    assert.notOk(treatmentAfterUnload.openbaar);

  });

});
