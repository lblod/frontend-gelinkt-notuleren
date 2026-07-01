import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import type { SayController } from '@lblod/ember-rdfa-editor';
import type { ModelFrom } from 'frontend-gelinkt-notuleren/utils/types';
import type TemplateFetcher from 'frontend-gelinkt-notuleren/services/template-fetcher';
import { EDITOR_FOLDERS } from 'frontend-gelinkt-notuleren/config/constants';
import type AgendapointEditorService from 'frontend-gelinkt-notuleren/services/editor/agendapoint';
import type DocumentContainerModel from 'frontend-gelinkt-notuleren/models/document-container';
import type { Template } from 'frontend-gelinkt-notuleren/services/template-fetcher';
import type Plausible from 'ember-plausible/services/plausible';
import type Store from 'frontend-gelinkt-notuleren/services/store';
import type MeetingsEditAgendapointNewRoute from 'frontend-gelinkt-notuleren/routes/meetings/edit/agendapoint/new';

export default class MeetingsEditNewController extends Controller {
  declare model: ModelFrom<MeetingsEditAgendapointNewRoute>;
  @service declare store: Store;
  @service declare router: RouterService;
  @service declare templateFetcher: TemplateFetcher;
  @service declare plausible: Plausible;
  @service('editor/agendapoint')
  declare agendapointEditor: AgendapointEditorService;
  @tracked editor?: SayController;

  folderId = EDITOR_FOLDERS.DECISION_DRAFTS;

  @action
  async redirectToAgendapoint(
    container: DocumentContainerModel,
    chosenTemplate: Template,
  ) {
    const { agendapoint } = this.model;
    if (agendapoint) {
      const newTitle = (await container.currentVersion)?.title;

      if (newTitle && agendapoint.titel !== newTitle) {
        agendapoint.titel = newTitle;
        await agendapoint.save();
      }
    } else {
      console.warn(
        "Couldn't find agendapoint that newly made container belongs to, very strange",
      );
    }
    // Plausible Analytics: post custom event about the template used to create the agendapoint

    void this.plausible.trackEvent('Create agendapoint', {
      templateTitle: chosenTemplate.title,
    });
    this.router.transitionTo('meetings.edit.agendapoint.edit', container.id);
  }

  get editorConfig() {
    return this.agendapointEditor.config;
  }

  getTemplates = async ({
    filter,
    pagination,
    favourites,
    abortSignal,
  }: {
    filter: { title: string };
    templateType: string;
    titleFilter?: string;
    pagination?: { pageSize: number; pageNumber: number };
    favourites?: string[];
    abortSignal?: AbortSignal;
  }) => {
    const dynamicTemplatesPromise = this.templateFetcher.fetch.perform({
      templateType:
        'http://data.lblod.info/vocabularies/gelinktnotuleren/BesluitTemplate',
      titleFilter: filter?.title,
      pagination,
      favourites,
      abortSignal,
    });
    const [results, totalCount] = await dynamicTemplatesPromise;
    return { results, totalCount };
  };

  @action
  cancelAgendapointCreation() {
    this.router.transitionTo('meetings.edit', this.model.returnToMeeting.id);
  }

  get documentTitle() {
    return this.model.editorDocument?.title;
  }

  get container() {
    return this.model.documentContainer;
  }
}
