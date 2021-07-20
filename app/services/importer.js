import Service from '@ember/service';
import {analyse} from '@lblod/marawa/rdfa-context-scanner';

const meetingKeys = {
  'http://data.vlaanderen.be/ns/besluit#geplandeStart': 'geplandeStart',
  'http://www.w3.org/ns/prov#endedAtTime': 'geeindigdOpTijdstip',
  'http://www.w3.org/ns/prov#startedAtTime': 'gestartOpTijdstip',
  'http://www.w3.org/ns/prov#atLocation': 'opLocatie'
}

const agendapointKeys = {}

const behandelingKeys = {
  'http://data.vlaanderen.be/ns/besluit#openbaar': 'openbaar'
}

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
    let meetingUri = '';
    const agendapointUris = [];
    const behandelingUris = [];

    for(let triple of triples) {
      if(triple.predicate === 'a') {
        if(triple.object === 'http://data.vlaanderen.be/ns/besluit#Zitting') {
          meetingUri = triple.subject;
        } else if(triple.object === 'http://data.vlaanderen.be/ns/besluit#Agendapunt') {
          agendapointUris.push(triple.subject)
        }else if(triple.object === 'http://data.vlaanderen.be/ns/besluit#BehandelingVanAgendapunt') {
          behandelingUris.push(triple.subject)
        }
      }
    }

    const meetingTriples = [];
    const agendapointTriples = {};
    const behandelingTriples = {};
    for(let triple of triples) {
      if(triple.subject === meetingUri) {
        meetingTriples.push(triple);
      } else if(agendapointUris.includes(triple.subject)) {
        if(agendapointTriples[triple.subject]) {
          agendapointTriples[triple.subject].push(triple)
        } else {
          agendapointTriples[triple.subject] = [triple]
        }
      } else if(behandelingUris.includes(triple.subject)) {
        if(behandelingTriples[triple.subject]) {
          behandelingTriples[triple.subject].push(triple)
        } else {
          behandelingTriples[triple.subject] = [triple]
        }
      }
    }
    console.log(meetingTriples)
    console.log(agendapointTriples)
    console.log(behandelingTriples)
    const meeting = this.processTriples(meetingTriples, meetingKeys);
    console.log(meeting)
    const agendapoints = {};
    for(let key in agendapointTriples) {
      agendapoints[key] = this.processTriples(agendapointTriples[key], agendapointKeys)
    }
    const behandelings = {};
    for(let key in behandelingTriples) {
      behandelings[key] = this.processTriples(behandelingTriples[key], behandelingKeys)
    }
    console.log(behandelings)
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
    const resultObject = {}
    for(let triple of triples) {
      const key = triplesMap[triple.predicate];
      if(!key) continue;
      resultObject[key] = triple.object;
    }
    return resultObject;
  }
}