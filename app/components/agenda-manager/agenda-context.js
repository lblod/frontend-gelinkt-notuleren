import Component from '@glimmer/component';
import { task, all } from 'ember-concurrency';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from 'tracked-built-ins';
import {
  DRAFT_STATUS_ID,
  PUBLISHED_STATUS_ID,
  SCHEDULED_STATUS_ID,
} from '../../utils/constants';

export default class AgendaManagerAgendaContextComponent extends Component {
  @service store;
  @tracked _newItem;
  @tracked items = tracked([]);
  changeSet = new Set();

  constructor(...args) {
    super(...args);
    this.loadItemsTask.perform();
  }

  loadItemsTask = task(async () => {
    const agendaItems = [];
    const pageSize = 10;

    const firstPage = await this.store.query('agendapunt', {
      'filter[zitting][:id:]': this.args.zittingId,
      'page[size]': pageSize,
      include:
        'vorige-agendapunt,behandeling.vorige-behandeling-van-agendapunt',
    });
    const count = firstPage.meta.count;
    firstPage.forEach((result) => agendaItems.push(result));
    let pageNumber = 1;

    while (pageNumber * pageSize < count) {
      const pageResults = await this.store.query('agendapunt', {
        'filter[zitting][:id:]': this.args.zittingId,
        'page[size]': pageSize,
        'page[number]': pageNumber,
        include:
          'vorige-agendapunt,behandeling.vorige-behandeling-van-agendapunt',
      });
      pageResults.forEach((result) => agendaItems.push(result));
      pageNumber++;
    }
    this.items = tracked(agendaItems.sortBy('position'));
  });

  /**
   * Create a new agenda item
   * @return {Agendapunt} the newly created item
   */
  @action
  createAgendaItem() {
    const agendaItem = this.store.createRecord('agendapunt', {
      titel: '',
      beschrijving: '',
      geplandOpenbaar: true,
      position: this.items.length,
    });

    agendaItem.behandeling = this.store.createRecord(
      'behandeling-van-agendapunt',
      {
        openbaar: agendaItem.geplandOpenbaar,
        onderwerp: agendaItem,
      },
    );

    this.args.onCreate(agendaItem);
    return agendaItem;
  }

  /**
   * Update and persist an item. Makes sure the local tracking array,
   * links and position properties of all items are in sync.
   *
   * @param {Agendapunt} item
   */
  updateItemTask = task(async (item) => {
    const treatment = await item.behandeling;
    await treatment.saveAndPersistDocument();

    if (item.isNew) {
      const zitting = await this.store.findRecord(
        'zitting',
        this.args.zittingId,
      );
      this.setProperty(item, 'zitting', zitting);
      this.setProperty(treatment, 'openbaar', item.geplandOpenbaar);
    }

    await this.updatePositionTask.unlinked().perform(item);

    const container = await treatment.get('documentContainer');
    const status = await container.get('status');
    if (!status || status.get('id') !== PUBLISHED_STATUS_ID) {
      // it's not published, so we set the status
      const conceptStatus = await this.store.findRecord(
        'concept',
        SCHEDULED_STATUS_ID,
      );
      this.setProperty(container, 'status', conceptStatus);
    }

    this.changeSet.add(item);
    await this.saveItemsTask.unlinked().perform();
  });

  /**
   * Delete an agenda item
   * @param {Agendapunt} item the item to be deleted
   */
  deleteItemTask = task(async (item) => {
    // we don't use item.position here to guard against problems
    // with position logic. The performance hit of searching here
    // is probably minimal.
    const index = this.items.indexOf(item);

    this.items.splice(index, 1);

    const treatment = await item.behandeling;
    if (treatment) {
      const container = await treatment.documentContainer;
      if (container) {
        const draftStatus = await this.store.findRecord(
          'concept',
          DRAFT_STATUS_ID,
        );
        this.setProperty(container, 'status', draftStatus);
      }
      await treatment.destroyRecord();
    }
    await item.destroyRecord();
    await this.repairPositionsTask.unlinked().perform();
    await this.saveItemsTask.unlinked().perform();
  });

  /**
   * Handles a rearrangement of the this.items array
   * Takes the array index as source of truth.
   */
  onSortTask = task(async () => {
    await this.repairPositionsTask.unlinked().perform();
    await this.saveItemsTask.unlinked().perform();
  });

  resetItemTask = task(async (agendaItem) => {
    let behandeling = await agendaItem.behandeling;
    behandeling.rollbackAttributes();
    agendaItem.rollbackAttributes();

    this.args.onCancel();
  });

  /**
   * Take item.position as source of truth and update the linked list and the this.items
   * array to reflect the new position
   *
   * @param {Agendapunt} item
   * @private
   */
  updatePositionTask = task(async (item) => {
    const position = item.position;

    if (this.items[position] !== item) {
      const oldIndex = this.items.indexOf(item);
      if (oldIndex > -1) {
        this.items.splice(oldIndex, 1);
      }
      this.items.splice(position, 0, item);
      await this.repairPositionsTask.unlinked().perform();
    }
  });

  /**
   * Take the this.items array index as source of truth and
   * update the item position and links
   * Only updates when necessary, does not persist the changes
   *
   * @private
   * */
  repairPositionsTask = task(async () => {
    let previous = null;
    for (const [index, item] of this.items.entries()) {
      const previousItem = await item.vorigeAgendapunt;
      if (item.position !== index || previousItem !== previous) {
        this.setProperty(item, 'position', index);
        this.setProperty(item, 'vorigeAgendapunt', previous);
        const treatment = await item.behandeling;
        if (treatment) {
          if (previous) {
            const previousTreatment = await previous.behandeling;
            this.setProperty(
              treatment,
              'vorigeBehandelingVanAgendapunt',
              previousTreatment,
            );
          } else {
            this.setProperty(treatment, 'vorigeBehandelingVanAgendapunt', null);
          }
        }
      }
      previous = item;
    }
  });

  /**
   * Save all items with changed attributes in the array
   * @private
   */
  saveItemsTask = task(async () => {
    await all([...this.changeSet].map((model) => model.save()));
    this.changeSet.clear();
    await this.args.onSave();
  });

  /**
   * Set a property on an ember data model and track its changes.
   * The reason for this is that hasDirtyAttributes does not track
   * relationship changes.
   *
   * @param {Model} model
   * @param {string} property
   * @param {unknown} value
   * @private
   */
  setProperty(model, property, value) {
    if (value !== model.get(property)) {
      this.changeSet.add(model);
    }
    model.set(property, value);
  }
}
