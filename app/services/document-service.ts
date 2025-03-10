// There's clearly something wrong with the eslint config, but leave that for now...
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Service, { service } from '@ember/service';
import { analyse } from '@lblod/marawa/rdfa-context-scanner';
import { task } from 'ember-concurrency';
import { instantiateUuids } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/standard-template-plugin';
import templateUuidInstantiator from '@lblod/template-uuid-instantiator';
import { DRAFT_STATUS_ID } from 'frontend-gelinkt-notuleren/utils/constants';
import type Store from 'frontend-gelinkt-notuleren/services/store';
import type EditorDocumentModel from 'frontend-gelinkt-notuleren/models/editor-document';
import { type Context } from 'frontend-gelinkt-notuleren/config/editor-document-default-context';
import type Triple from '@lblod/marawa/triple';
import type BestuurseenheidModel from 'frontend-gelinkt-notuleren/models/bestuurseenheid';
import { type Template } from 'frontend-gelinkt-notuleren/services/template-fetcher';
import type DocumentContainerModel from 'frontend-gelinkt-notuleren/models/document-container';

interface PersistDocumentArgs {
  template: Template;
  title: string;
  folderId: string;
  group: BestuurseenheidModel;
}

export default class DocumentService extends Service {
  @service declare store: Store;

  extractTriplesFromDocument(editorDocument: EditorDocumentModel) {
    const node = document.createElement('body');
    const context: Context = JSON.parse(editorDocument.context);
    const prefixes = this.convertPrefixesToString(context.prefix);
    node.setAttribute('vocab', context.vocab);
    node.setAttribute('prefix', prefixes);
    node.innerHTML = editorDocument.content;
    const thing = analyse(node);
    console.log({ thing });
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
        const editorDocument = this.store.createRecord('editor-document', {
          createdOn: creationDate,
          updatedOn: creationDate,
          content: content ?? '',
          title: title.trim(),
          // type assertion as passing EditorDocumentModel to the generic type arg of createRecord
          // doesn't seem to work
        }) as EditorDocumentModel;
        if (previousDocument) {
          editorDocument.previousVersion = previousDocument;
        }
        editorDocument.documentContainer = documentContainer;
        // @ts-expect-error this was already here when adding types...
        editorDocument.parts = await this.retrieveDocumentParts(editorDocument);
        await editorDocument.save();
        documentContainer.currentVersion = editorDocument;
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
        const trimmedHtml = template.body.replace(/>\s+</g, '><');
        //If the template comes from RB we instantiate it with the new library
        return templateUuidInstantiator(trimmedHtml);
      } else {
        const trimmedHtml = template.body.replace(/>\s+</g, '><');
        // If it's a built=in template, we apply both instantiate functions
        return instantiateUuids(templateUuidInstantiator(trimmedHtml));
      }
    } else return '';
  }

  persistDocument = task(
    async ({ template, title, folderId, group }: PersistDocumentArgs) => {
      const generatedTemplate = await this.buildTemplate(template);
      const container = this.store.createRecord<DocumentContainerModel>(
        'document-container',
        {},
      );
      container.status = await this.store.findRecord(
        'concept',
        DRAFT_STATUS_ID,
      );
      container.folder = await this.store.findRecord(
        'editor-document-folder',
        folderId,
      );
      container.publisher = group;
      const editorDocument = await this.createEditorDocument.perform(
        title,
        generatedTemplate,
        container,
      );
      container.currentVersion = editorDocument;
      await container.save();
      return container;
    },
  );

  async retrieveDocumentParts(document: EditorDocumentModel) {
    return Promise.all(
      this.getDocumentparts(document).map(async (uri) => {
        const part = (
          await this.store.query('document-container', {
            'filter[:uri:]': uri,
            // @ts-expect-error no idea how to configure this to work correctly...
            include: 'is-part-of',
          })
        )[0];
        return part;
      }),
    );
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
          // @ts-expect-error no idea how to configure this to work correctly...
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
