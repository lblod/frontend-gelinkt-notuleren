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

  getTemplates = async ({ filter: _, pagination, abortSignal }) => {
    const standardTemplatesPromise = this.standardTemplate.fetchTemplates
      .perform()
      .then((standardTemplates) => {
        return this.standardTemplate.templatesForContext(standardTemplates, [
          'http://data.vlaanderen.be/ns/besluit#BehandelingVanAgendapunt',
        ]);
      });
    const dynamicTemplatesPromise = this.templateFetcher.fetch.perform({
      templateType:
        'http://data.lblod.info/vocabularies/gelinktnotuleren/BesluitTemplate',
      abortSignal,
    });
    const results = await Promise.all([
      standardTemplatesPromise,
      dynamicTemplatesPromise,
    ]).then((result) => result.flat());

    // TODO can we do 'proper' pagination since we want to combine different sources of templates
    const firstRes = pagination.pageNumber * pagination.pageSize;
    const paginated = results.slice(firstRes, firstRes + pagination.pageSize);
    return { results: paginated, totalCount: results.length };
  };

  @action
  cancelAgendapointCreation() {
    this.router.legacyTransitionTo('inbox.agendapoints');
  }
}
