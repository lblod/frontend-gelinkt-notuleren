import Service, { inject as service } from '@ember/service';
import { task, waitForProperty } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

const BLACKLISTED_TEMPLATES = new Set(['Citeeropschrift']);

export default class StandardTemplateService extends Service {
  @service store;
  @tracked templates;

  constructor(...args) {
    super(...args);
    this.loadTemplates().catch((err) =>
      console.error('Error loading standard templates', err),
    );
  }

  fetchTemplates = task(async () => {
    await waitForProperty(this, 'templates');
    return this.templates;
  });

  async loadTemplates() {
    const templates = await this.store.findAll('template');
    this.templates = templates.filter(
      (template) => !BLACKLISTED_TEMPLATES.has(template.title),
    );
  }

  /**
   Filter the valid templates for a context.
   @method templatesForContext
   @param {Array} Array of templates
   @param {Array} The path of rdfaContext objects from the root till the current context
   @return {Array} Array of templates (filtered)
   @private
   */
  templatesForContext(templates, rdfaTypes) {
    const isMatchingForContext = (template) => {
      return (
        rdfaTypes.filter((e) => template.get('contexts').includes(e)).length >
          0 &&
        rdfaTypes.filter((e) => template.get('disabledInContexts').includes(e))
          .length === 0
      );
    };
    return templates.filter(isMatchingForContext);
  }
}
