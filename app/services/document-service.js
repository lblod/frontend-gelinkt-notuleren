import Service, { service } from '@ember/service';
import { analyse } from '@lblod/marawa/rdfa-context-scanner';
import { task } from 'ember-concurrency';
/** @import { Task } from 'ember-concurrency'; */
import { instantiateUuids } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/standard-template-plugin';
import templateUuidInstantiator from '@lblod/template-uuid-instantiator';
import { DRAFT_STATUS_ID } from 'frontend-gelinkt-notuleren/utils/constants';
/** @import BestuurseenheidModel from 'frontend-gelinkt-notuleren/models/bestuurseenheid'; */
/** @import { Template } from 'frontend-gelinkt-notuleren/services/template-fetcher'; */

export default class DocumentService extends Service {
  @service store;

  extractTriplesFromDocument(editorDocument) {
    const node = document.createElement('body');
    const context = JSON.parse(editorDocument.context);
    const prefixes = this.convertPrefixesToString(context.prefix);
    node.setAttribute('vocab', context.vocab);
    node.setAttribute('prefix', prefixes);
    node.innerHTML = editorDocument.content;
    const contexts = analyse(node).map((c) => c.context);
    const triples = this.cleanupTriples(contexts.flat());
    return triples;
  }
  getDescription(editorDocument) {
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
    )[0].object;
    return descriptionOfFirstDecision;
  }
  cleanupTriples(triples) {
    const cleantriples = {};
    for (const triple of triples) {
      const hash = JSON.stringify(triple);
      cleantriples[hash] = triple;
    }
    return Object.keys(cleantriples).map((k) => cleantriples[k]);
  }
  convertPrefixesToString(prefix) {
    let prefixesString = '';
    for (let prefixKey in prefix) {
      prefixesString += `${prefixKey}: ${prefix[prefixKey]} `;
    }
    return prefixesString;
  }
  getDecisions(editorDocument) {
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
      )[0].object;
      return {
        uri,
        title,
      };
    });
    return decisions;
  }

  getDocumentparts(editorDocument) {
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
    async (title, content, documentContainer, previousDocument) => {
      if (!title || !documentContainer) {
        throw 'title and documentContainer are required';
      } else {
        const creationDate = new Date();
        const editorDocument = this.store.createRecord('editor-document', {
          createdOn: creationDate,
          updatedOn: creationDate,
          content: content ?? '',
          title: title.trim(),
        });
        if (previousDocument) {
          editorDocument.previousVersion = previousDocument;
        }
        editorDocument.documentContainer = documentContainer;
        editorDocument.parts = await this.retrieveDocumentParts(editorDocument);
        await editorDocument.save();
        documentContainer.currentVersion = editorDocument;
        await documentContainer.save();
        return editorDocument;
      }
    },
  );
  /**
   * @param {Template} template
   * @return {Promise<string>}
   */
  async buildTemplate(template) {
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

  /**
   * @typedef {Object} PersistDocumentArgs
   * @property {Template} template
   * @property {string} title
   * @property {string} folderId
   * @property {BestuurseenheidModel} group
   */
  /** @type {Task<unknown, [PersistDocumentArgs]>} */
  persistDocument = task(
    /** @type {(args: PersistDocumentArgs) => Promise<unknown>} */
    async ({ template, title, folderId, group }) => {
      const generatedTemplate = await this.buildTemplate(template);
      const container = this.store.createRecord('document-container');
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

  async retrieveDocumentParts(document) {
    return Promise.all(
      this.getDocumentparts(document).map(async (uri) => {
        const part = (
          await this.store.query('document-container', {
            'filter[:uri:]': uri,
            include: 'is-part-of',
          })
        )[0];
        return part;
      }),
    );
  }

  fetchRevisions = task(
    async (documentContainerId, revisionsToSkip, pageSize, pageNumber) => {
      const revisions = await this.store.query('editor-document', {
        'filter[document-container][id]': documentContainerId,
        include: 'status',
        sort: '-updated-on',
        'page[size]': pageSize,
        'page[number]': pageNumber,
      });
      const revisionsWithoutCurrentVersion = revisions.filter(
        (revision) => !revisionsToSkip.includes(revision.id),
      );
      return revisionsWithoutCurrentVersion;
    },
  );
}
