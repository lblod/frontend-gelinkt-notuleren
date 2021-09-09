import Service from '@ember/service';
import {analyse} from '@lblod/marawa/rdfa-context-scanner';

export default class DocumentService extends Service {
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
    const decisionUris = triples.filter((t) => t.predicate === "a" && t.object === "http://data.vlaanderen.be/ns/besluit#Besluit");
    const firstDecision = decisionUris[0];
    if(!firstDecision) return '';
    const descriptionOfFirstDecision = triples.filter((t) => t.predicate === 'http://data.europa.eu/eli/ontology#description' && t.subject === firstDecision.subject)[0].object;
    return descriptionOfFirstDecision;
  }
  cleanupTriples(triples) {
    const cleantriples = {};
    for (const triple of triples) {
      const hash = JSON.stringify(triple);
      cleantriples[hash]=triple;
    }
    return Object.keys(cleantriples).map( (k) => cleantriples[k]);
  }
  convertPrefixesToString(prefix) {
    let prefixesString = '';
    for(let prefixKey in prefix) {
      prefixesString += `${prefixKey}: ${prefix[prefixKey]} `;
    }
    return prefixesString;
  }
  getDecisions(editorDocument) {
    const triples = this.extractTriplesFromDocument(editorDocument);
    const decisionUris = triples.filter((t) => t.predicate === "a" && t.object === "http://data.vlaanderen.be/ns/besluit#Besluit");
    const decisions = decisionUris.map((decisionUriTriple) => {
      const uri =  decisionUriTriple.subject;
      const title = triples.filter((t) => t.predicate === 'http://data.europa.eu/eli/ontology#title' && t.subject === uri)[0].object;
      return {
        uri,
        title
      };
    });
    return decisions;
  }
}