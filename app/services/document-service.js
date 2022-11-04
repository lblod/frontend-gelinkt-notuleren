import Service from '@ember/service';
import { analyse } from '@lblod/marawa/rdfa-context-scanner';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';

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
        t.predicate === 'a' &&
        t.object === 'http://data.vlaanderen.be/ns/besluit#Besluit'
    );
    const firstDecision = decisionUris[0];
    if (!firstDecision) return '';
    const descriptionOfFirstDecision = triples.filter(
      (t) =>
        t.predicate === 'http://data.europa.eu/eli/ontology#description' &&
        t.subject === firstDecision.subject
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
        t.predicate === 'a' &&
        t.object === 'http://data.vlaanderen.be/ns/besluit#Besluit'
    );
    const decisions = decisionUris.map((decisionUriTriple) => {
      const uri = decisionUriTriple.subject;
      const title = triples.filter(
        (t) =>
          t.predicate === 'http://data.europa.eu/eli/ontology#title' &&
          t.subject === uri
      )[0].object;
      return {
        uri,
        title,
      };
    });
    return decisions;
  }

  @task
  *createEditorDocument(title, content, documentContainer, previousDocument) {
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
      yield editorDocument.save();
      // yield this.updateLinkedDocuments(previousDocument, editorDocument); //TODO: we should investigate what is the best way on saving the document parts in the database models
      documentContainer.currentVersion = editorDocument;
      yield documentContainer.save();
      return editorDocument;
    }
  }

  getDocumentparts(editorDocument) {
    const triples = this.extractTriplesFromDocument(editorDocument);
    const documentpartUris = triples
      .filter(
        (t) =>
          t.predicate === 'a' &&
          t.object ===
            'https://data.vlaanderen.be/doc/applicatieprofiel/besluit-publicatie#Documentonderdeel'
      )
      .map((triple) => triple.subject);
    return documentpartUris;
  }

  async updateLinkedDocuments(previousDocument, newDocument) {
    if (previousDocument) {
      this.getDocumentparts(previousDocument).map(async (uri) => {
        const part = (
          await this.store.query('document-container', {
            'filter[:uri:]': uri,
            include: 'is-part-of',
          })
        ).firstObject;
        if (part) {
          part.isPartOf = null;
          await part.save();
        }
      });
    }

    this.getDocumentparts(newDocument).map(async (uri) => {
      const part = (
        await this.store.query('document-container', {
          'filter[:uri:]': uri,
          include: 'is-part-of',
        })
      ).firstObject;
      if (part) {
        part.isPartOf = newDocument;
        await part.save();
      }
    });
  }
}
