import Service, { inject as service } from '@ember/service';
import { task, waitForProperty } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import type Owner from '@ember/owner';
import type StandardTemplate from '@lblod/ember-rdfa-editor-lblod-plugins/models/template';
import { isSome } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/option';
import type Store from 'frontend-gelinkt-notuleren/services/store';
import TemplateModel from 'frontend-gelinkt-notuleren/models/template';

const BLACKLISTED_TEMPLATES = new Set(['Citeeropschrift']);

export default class StandardTemplateService extends Service {
  @service declare store: Store;
  @tracked templates?: StandardTemplate[];

  constructor(owner: Owner | undefined) {
    super(owner);
    this.loadTemplates().catch((err) =>
      console.error('Error loading standard templates', err),
    );
  }

  fetchTemplates = task(async () => {
    await waitForProperty(this, 'templates', isSome);
    return this.templates;
  });

  async loadTemplates() {
    const templates = await this.store.findAll<TemplateModel>('template');
    this.templates = templates.filter(
      (template) => !BLACKLISTED_TEMPLATES.has(template.title ?? ''),
    ) as StandardTemplate[];
  }
}
