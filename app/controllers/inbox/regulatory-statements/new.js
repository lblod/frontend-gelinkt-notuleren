import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { EDITOR_FOLDERS } from 'frontend-gelinkt-notuleren/config/constants';

export default class InboxRegulatoryStatementsNewController extends Controller {
  @service router;
  @service plausible;
  @service templateFetcher;

  folderId = EDITOR_FOLDERS.REGULATORY_STATEMENTS;

  @action
  redirectToStatement(container, chosenTemplate) {
    // Plausible Analytics: post custom event about the template used to create the agendapoint
    this.plausible.trackEvent('Create regulatory-statement', {
      templateTitle: chosenTemplate.title,
    });
    this.router.transitionTo('regulatory-statements.edit', container.id);
  }

  getTemplates = async ({ filter, pagination, favourites, abortSignal }) => {
    const [templates, totalCount] = await this.templateFetcher.fetch.perform({
      templateType:
        'http://data.lblod.info/vocabularies/gelinktnotuleren/ReglementaireBijlageTemplate',
      titleFilter: filter?.title,
      pagination,
      favourites,
      abortSignal,
    });

    return { results: templates, totalCount };
  };

  @action
  cancelCreation() {
    this.router.legacyTransitionTo('inbox.regulatory-statements');
  }
}
