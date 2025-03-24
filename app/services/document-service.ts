import Service, { service } from '@ember/service';
import { task } from 'ember-concurrency';
import {
  type PromiseBelongsTo,
  type PromiseManyArray,
} from '@ember-data/model/-private';
import { analyse } from '@lblod/marawa/rdfa-context-scanner';
import type Triple from '@lblod/marawa/triple';
import { instantiateUuids } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/standard-template-plugin';
import { isSome } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/option';
import { setBesluitType } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/besluit-type-plugin/utils/set-besluit-type';
import { type BesluitTypeInstance } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/besluit-type-plugin/utils/besluit-type-instances';
import templateUuidInstantiator from '@lblod/template-uuid-instantiator';
import { DRAFT_STATUS_ID } from 'frontend-gelinkt-notuleren/utils/constants';
import type Store from 'frontend-gelinkt-notuleren/services/store';
import type EditorDocumentModel from 'frontend-gelinkt-notuleren/models/editor-document';
import { type Context } from 'frontend-gelinkt-notuleren/config/editor-document-default-context';
import type BestuurseenheidModel from 'frontend-gelinkt-notuleren/models/bestuurseenheid';
import { type Template } from 'frontend-gelinkt-notuleren/services/template-fetcher';
import type DocumentContainerModel from 'frontend-gelinkt-notuleren/models/document-container';
import type ConceptModel from 'frontend-gelinkt-notuleren/models/concept';
import type EditorDocumentFolderModel from 'frontend-gelinkt-notuleren/models/editor-document-folder';
import type AgendapointEditorService from 'frontend-gelinkt-notuleren/services/editor/agendapoint';

interface PersistDocumentArgs {
  template: Template;
  title: string;
  folderId: string;
  group: BestuurseenheidModel;
  decisionType?: BesluitTypeInstance;
}

export default class DocumentService extends Service {
  @service declare store: Store;
  @service('editor/agendapoint')
  declare agendapointEditor: AgendapointEditorService;

  extractTriplesFromDocument(editorDocument: EditorDocumentModel) {
    const node = document.createElement('body');
    const context = JSON.parse(editorDocument.context ?? '') as Context;
    const prefixes = this.convertPrefixesToString(context.prefix);
    node.setAttribute('vocab', context.vocab);
    node.setAttribute('prefix', prefixes);
    node.innerHTML = editorDocument.content ?? '';
    const contexts = analyse(node).map((c) => c.context);
    const triples = this.cleanupTriples(contexts.flat());
    return triples;
  }
  getDescription(editorDocument: EditorDocumentModel) {
    const triples = this.extractTriplesFromDocument(editorDocument);
    const decisionUris = triples.filter(
      (t) =>
        t.predicate === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' &&
        t.object === 'http://data.vlaanderen.be/ns/besluit#Besluit',
    );
    const firstDecision = decisionUris[0];
    if (!firstDecision) return '';
    const descriptionOfFirstDecision = triples.filter(
      (t) =>
        t.predicate === 'http://data.europa.eu/eli/ontology#description' &&
        t.subject === firstDecision.subject,
    )[0]?.object;
    return descriptionOfFirstDecision;
  }
  cleanupTriples(triples: Triple[]) {
    const cleantriples: Record<string, Triple> = {};
    for (const triple of triples) {
      const hash = JSON.stringify(triple);
      cleantriples[hash] = triple;
    }
    return Object.values(cleantriples);
  }
  convertPrefixesToString(prefix: Context['prefix']) {
    let prefixesString = '';
    for (const prefixKey in prefix) {
      prefixesString += `${prefixKey}: ${prefix[prefixKey]} `;
    }
    return prefixesString;
  }
  getDecisions(editorDocument: EditorDocumentModel) {
    const triples = this.extractTriplesFromDocument(editorDocument);
    const decisionUris = triples.filter(
      (t) =>
        t.predicate === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' &&
        t.object === 'http://data.vlaanderen.be/ns/besluit#Besluit',
    );
    const decisions = decisionUris.map((decisionUriTriple) => {
      const uri = decisionUriTriple.subject;
      const title = triples.filter(
        (t) =>
          t.predicate === 'http://data.europa.eu/eli/ontology#title' &&
          t.subject === uri,
      )[0]?.object;
      return {
        uri,
        title,
      };
    });
    return decisions;
  }

  getDocumentparts(editorDocument: EditorDocumentModel) {
    const triples = this.extractTriplesFromDocument(editorDocument);
    const documentpartUris = triples
      .filter(
        (t) =>
          t.predicate === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' &&
          t.object ===
            'https://data.vlaanderen.be/doc/applicatieprofiel/besluit-publicatie#Documentonderdeel',
      )
      .map((triple) => triple.subject);
    return documentpartUris;
  }

  createEditorDocument = task(
    async (
      title: string,
      content: string | undefined,
      documentContainer: DocumentContainerModel,
      previousDocument?: EditorDocumentModel,
    ) => {
      if (!title || !documentContainer) {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw 'title and documentContainer are required';
      } else {
        const creationDate = new Date();
        const editorDocument = this.store.createRecord<EditorDocumentModel>(
          'editor-document',
          {
            createdOn: creationDate,
            updatedOn: creationDate,
            content: content ?? '',
            title: title.trim(),
          },
        );
        if (previousDocument) {
          editorDocument.previousVersion =
            previousDocument as unknown as PromiseBelongsTo<EditorDocumentModel>;
        }
        editorDocument.documentContainer =
          documentContainer as unknown as PromiseBelongsTo<DocumentContainerModel>;
        editorDocument.parts = (await this.retrieveDocumentParts(
          editorDocument,
        )) as unknown as PromiseManyArray<DocumentContainerModel>;
        await editorDocument.save();
        documentContainer.currentVersion =
          editorDocument as unknown as PromiseBelongsTo<EditorDocumentModel>;
        await documentContainer.save();
        return editorDocument;
      }
    },
  );

  async buildTemplate(template: Template): Promise<string> {
    if (template) {
      /**
       * Document Creator component is used by two different screens:
       *   - Create agenda point flow
       *   - Create regulatory statements flow
       *
       * `templates` coming from regulatory statements flow are _NOT_ `TemplateModel` instances,
       * they are just plain objects with a `title` and a `loadTemplateBody` property. So we
       * have to use `loadTemplateBody` to load the template body if we need to build the template
       * when creating a regulatory statement.
       *
       * This was previously checking and calling `this.template.reload`, but that was causing
       * `reload` to mutate from function to a "boolean" when `TemplateModel` of `ember-data` is used,
       * causing errors when calling `reload` on the template again, as it became a boolean.
       *
       * The fix was to change `reload` to `loadTemplateBody` in `RegulatoryAttachmentsFetcher`
       */
      if (template.loadBody) {
        await template.loadBody();
        const trimmedHtml = template.body?.replace(/>\s+</g, '><') ?? '';
        //If the template comes from RB we instantiate it with the new library
        return templateUuidInstantiator(trimmedHtml);
      } else {
        const trimmedHtml = template.body?.replace(/>\s+</g, '><') ?? '';
        // If it's a built=in template, we apply both instantiate functions
        return instantiateUuids(templateUuidInstantiator(trimmedHtml));
      }
    } else return '';
  }

  persistDocument = task(
    async ({
      template,
      title,
      folderId,
      group,
      decisionType,
    }: PersistDocumentArgs) => {
      let generatedTemplate = await this.buildTemplate(template);
      if (decisionType) {
        generatedTemplate = this.agendapointEditor.processDocumentHeadlessly(
          generatedTemplate,
          (state) => setBesluitType(state, decisionType),
        );
      }
      const container = this.store.createRecord<DocumentContainerModel>(
        'document-container',
        {},
      );
      container.status = (await this.store.findRecord(
        'concept',
        DRAFT_STATUS_ID,
      )) as PromiseBelongsTo<ConceptModel>;
      container.folder = (await this.store.findRecord(
        'editor-document-folder',
        folderId,
      )) as PromiseBelongsTo<EditorDocumentFolderModel>;
      container.publisher =
        group as unknown as PromiseBelongsTo<BestuurseenheidModel>;
      const editorDocument = await this.createEditorDocument.perform(
        title,
        generatedTemplate,
        container,
      );
      container.currentVersion =
        editorDocument as unknown as PromiseBelongsTo<EditorDocumentModel>;
      await container.save();
      return container;
    },
  );

  async retrieveDocumentParts(document: EditorDocumentModel) {
    const parts = await Promise.all(
      this.getDocumentparts(document).map(async (uri) => {
        const part = (
          await this.store.query<DocumentContainerModel>('document-container', {
            'filter[:uri:]': uri,
            // @ts-expect-error I assume this error is due to ConceptModel not being properly typed
            include: 'is-part-of',
          })
        )[0];
        return part;
      }),
    );
    return parts.filter(isSome);
  }

  fetchRevisions = task(
    async (
      documentContainerId: string,
      revisionsToSkip: string[],
      pageSize: number,
      pageNumber: number,
    ) => {
      const revisions = await this.store.query<EditorDocumentModel>(
        'editor-document',
        {
          'filter[document-container][id]': documentContainerId,
          // @ts-expect-error I assume this error is due to ConceptModel not being properly typed
          include: 'status',
          sort: '-updated-on',
          'page[size]': pageSize,
          'page[number]': pageNumber,
        },
      );
      const revisionsWithoutCurrentVersion = revisions.filter(
        (revision) => !revision.id || !revisionsToSkip.includes(revision.id),
      );
      return revisionsWithoutCurrentVersion;
    },
  );
}
