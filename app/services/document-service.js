import Service from '@ember/service';
import {analyse} from '@lblod/marawa/rdfa-context-scanner';

export default class DocumentService extends Service {
  getDescription(html) {
    const node = document.createElement('body');
    node.innerHTML = html;
    const contexts = analyse(node).map((c) => c.context);
    const triples = this.cleanupTriples(contexts.flat());
    const firstDecision = triples.filter((t) => t.predicate === "a" && t.object === "http://data.vlaanderen.be/ns/besluit#Besluit")[0].subject;
    const descriptionOfFirstDecision = triples.filter((t) => t.predicate === 'eli:description' && t.subject === firstDecision)[0].object;
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
}