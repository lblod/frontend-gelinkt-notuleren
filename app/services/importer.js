import Service from '@ember/service';
import {analyse} from '@lblod/marawa/rdfa-context-scanner';

const keys = {
  'http://data.vlaanderen.be/ns/besluit#Zitting': {
    'http://data.vlaanderen.be/ns/besluit#geplandeStart': 'geplandeStart',
    'http://www.w3.org/ns/prov#endedAtTime': 'geeindigdOpTijdstip',
    'http://www.w3.org/ns/prov#startedAtTime': 'gestartOpTijdstip',
    'http://www.w3.org/ns/prov#atLocation': 'opLocatie'
  },
  'http://data.vlaanderen.be/ns/besluit#Agendapunt': {
    'http://purl.org/dc/terms/title': 'titel',
    'http://purl.org/dc/terms/description': 'beschrijving',
    'http://data.vlaanderen.be/ns/besluit#geplandOpenbaar': 'geplandOpenbaar'
  },
  'http://data.vlaanderen.be/ns/besluit#BehandelingVanAgendapunt': {
    'http://data.vlaanderen.be/ns/besluit#openbaar': 'openbaar'
  },
  'http://data.vlaanderen.be/ns/mandaat#Mandataris': {
    'http://data.vlaanderen.be/ns/mandaat#isBestuurlijkeAliasVan': 'isBestuurlijkeAliasVan',
    'http://www.w3.org/ns/org#holds': 'bekleedt'
  },
  'http://data.lblod.info/vocabularies/leidinggevenden/Functionaris': {
    'http://data.vlaanderen.be/ns/mandaat#isBestuurlijkeAliasVan': 'isBestuurlijkeAliasVan',
    'http://www.w3.org/ns/org#holds': 'bekleedt'
  },
  'http://www.w3.org/ns/person#Person': {
    'http://data.vlaanderen.be/ns/persoon#gebruikteVoornaam': 'gebruikteVoornaam',
    'http://xmlns.com/foaf/0.1/familyName': 'achternaam'
  },
  'http://data.vlaanderen.be/ns/mandaat#Mandaat': {
    'http://www.w3.org/ns/org#role': 'bestuursfunctie'
  },
  'http://www.w3.org/2004/02/skos/core#Concept': {
    'http://www.w3.org/2004/02/skos/core#prefLabel': 'label'
  }
};

export default class Importer extends Service {
  extractTriplesFromHTML(html) {
    const node = document.createElement('body');
    node.innerHTML = html;
    const contexts = analyse(node).map((c) => c.context);
    const triples = this.cleanupTriples(contexts.flat());
    return triples;
  }
  importDocument(html) {
    const triples = this.extractTriplesFromHTML(html);

    const uris = {};
    for(let triple of triples) {
      if(triple.predicate === 'a') {
        console.log(triple.object)
        if(uris[triple.object]) {
          uris[triple.object].push(triple.subject);
        } else {
          uris[triple.object] = [triple.subject];
        }
      }
    }

    const triplesByType = {};
    for(let triple of triples) {
      for(let type in uris) {
        if(!triplesByType[type]) triplesByType[type] = {};
        if(uris[type].includes(triple.subject)) {
          if(triplesByType[type][triple.subject]) {
            triplesByType[type][triple.subject].push(triple);
          } else {
            triplesByType[type][triple.subject] = [triple];
          }
        }
      }
    }

    const processedModels = {};
    for(let type in triplesByType) {
      //if(!keys[type]) continue;
      if(!processedModels[type]) processedModels[type] = {};
      for(let uri in triplesByType[type]) {
        if(!keys[type]) continue;
        processedModels[type][uri] = this.processTriples(triplesByType[type][uri], keys[type]);
      }
    }
    console.log(processedModels);
  }
  cleanupTriples(triples) {
    const cleantriples = {};
    for (const triple of triples) {
      const hash = JSON.stringify(triple);
      cleantriples[hash]=triple;
    }
    return Object.keys(cleantriples).map( (k) => cleantriples[k]);
  }
  processTriples(triples, triplesMap) {
    //TODO: support fields with multiple entries (Each entry can be a map to avoid duplication)
    const resultObject = {};
    for(let triple of triples) {
      const key = triplesMap[triple.predicate];
      if(!key) continue;
      resultObject[key] = triple.object;
    }
    return resultObject;
  }
}