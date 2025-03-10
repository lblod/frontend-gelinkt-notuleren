import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { EDITOR_FOLDERS } from 'frontend-gelinkt-notuleren/config/constants';

export default class InboxAgendapointsNewController extends Controller {
  @service router;
  @service plausible;
  @service standardTemplate;
  @service templateFetcher;

  folderId = EDITOR_FOLDERS.DECISION_DRAFTS;

  @action
  redirectToAgendapoint(container, chosenTemplate) {
    // Plausible Analytics: post custom event about the template used to create the agendapoint
    this.plausible.trackEvent('Create agendapoint', {
      templateTitle: chosenTemplate.title,
    });
    this.router.transitionTo('agendapoints.edit', container.id);
  }

  getTemplates = async ({ filter, pagination, abortSignal }) => {
    const dynamicTemplatesPromise = this.templateFetcher.fetch.perform({
      templateType:
        'http://data.lblod.info/vocabularies/gelinktnotuleren/BesluitTemplate',
      titleFilter: filter?.title,
      pagination,
      abortSignal,
    });
    if (pagination.pageNumber === 0) {
      const standardTemplatesPromise = this.standardTemplate.fetchTemplates
        .perform()
        .then((standardTemplates) => {
          return this.standardTemplate.templatesForContext(standardTemplates, [
            'http://data.vlaanderen.be/ns/besluit#BehandelingVanAgendapunt',
          ]);
        });
      // TODO this means there are actually more results on the first page, but we plan to remove
      // the 'standard' templates anyway
      const [results, totalCount] = await Promise.all([
        standardTemplatesPromise,
        dynamicTemplatesPromise,
      ]).then(([standard, [dynamic, dynamicCount]]) => [
        standard.concat(dynamic),
        dynamicCount + standard.length,
      ]);
      return { results, totalCount };
    } else {
      const [results, totalCount] = await dynamicTemplatesPromise;
      return { results, totalCount };
    }
  };

  @action
  cancelAgendapointCreation() {
    this.router.legacyTransitionTo('inbox.agendapoints');
  }
}
