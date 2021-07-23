import Service from '@ember/service';
import {analyse} from '@lblod/marawa/rdfa-context-scanner';
import { inject as service } from '@ember/service';

const keys = {
  'http://data.vlaanderen.be/ns/besluit#Zitting': {
    'http://data.vlaanderen.be/ns/besluit#geplandeStart': 'geplandeStart',
    'http://www.w3.org/ns/prov#endedAtTime': 'geeindigdOpTijdstip',
    'http://www.w3.org/ns/prov#startedAtTime': 'gestartOpTijdstip',
    'http://www.w3.org/ns/prov#atLocation': 'opLocatie',
    'http://data.vlaanderen.be/ns/besluit#heeftAanwezigeBijStart': 'aanwezigenBijStart',
    'http://mu.semte.ch/vocabularies/ext/heeftAfwezigeBijStart': 'afwezigenBijStart',
    'http://data.vlaanderen.be/ns/besluit#heeftVoorzitter': 'voorzitter',
    'http://data.vlaanderen.be/ns/besluit#heeftSecretaris': 'secretaris',
    'http://data.vlaanderen.be/ns/besluit#behandelt': 'agendapunten',
    'http://data.vlaanderen.be/ns/besluit#isGehoudenDoor': 'bestuursorgaan',

  },
  'http://data.vlaanderen.be/ns/besluit#Agendapunt': {
    'http://purl.org/dc/terms/title': 'titel',
    'http://purl.org/dc/terms/description': 'beschrijving',
    'http://data.vlaanderen.be/ns/besluit#geplandOpenbaar': 'geplandOpenbaar',
    'http://purl.org/dc/terms/subject': 'onderwerp'
  },
  'http://data.vlaanderen.be/ns/besluit#BehandelingVanAgendapunt': {
    'http://data.vlaanderen.be/ns/besluit#openbaar': 'openbaar',
    'http://data.vlaanderen.be/ns/besluit#heeftStemming': 'stemmingen',
    'http://data.vlaanderen.be/ns/besluit#heeftAanwezigeBijStart': 'aanwezigenBijStart',
    'http://mu.semte.ch/vocabularies/ext/heeftAfwezigeBijStart': 'afwezigenBijStart',
    'http://data.vlaanderen.be/ns/besluit#heeftVoorzitter': 'voorzitter',
    'http://data.vlaanderen.be/ns/besluit#heeftSecretaris': 'secretaris'
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
  },
  'http://data.vlaanderen.be/ns/besluit#Stemming': {
    'http://data.vlaanderen.be/ns/besluit#geheim': 'geheim',
    'http://data.vlaanderen.be/ns/besluit#onderwerp': 'onderwerp',
    'http://data.vlaanderen.be/ns/besluit#heeftAanwezige': 'aanwezigen',
    'http://data.vlaanderen.be/ns/besluit#heeftStemmer': 'stemmers',
    'http://data.vlaanderen.be/ns/besluit#heeftVoorstander': 'voorstanders',
    'http://data.vlaanderen.be/ns/besluit#heeftTegenstander': 'tegenstanders',
    'http://data.vlaanderen.be/ns/besluit#heeftOnthouders': 'onthouders',
    'http://data.vlaanderen.be/ns/besluit#gevolg': 'gevolg',
    'http://data.vlaanderen.be/ns/besluit#aantalVoorstanders': 'aantalVoorstanders',
    'http://data.vlaanderen.be/ns/besluit#aantalTegenstanders': 'aantalTegenstanders',
    'http://data.vlaanderen.be/ns/besluit#aantalOnthouders': 'aantalOnthouders',
  },
};

export default class Importer extends Service {
  @service store;
  extractTriplesFromHTML(html) {
    const node = document.createElement('body');
    node.innerHTML = html;
    const contexts = analyse(node).map((c) => c.context);
    const triples = this.cleanupTriples(contexts.flat());
    return triples;
  }
  async importDocument(html) {
    const triples = this.extractTriplesFromHTML(html);

    const uris = {};
    for(let triple of triples) {
      if(triple.predicate === 'a') {
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
      if(!keys[type]) continue;
      if(!processedModels[type]) processedModels[type] = {};
      for(let uri in triplesByType[type]) {
        processedModels[type][uri] = this.processTriples(triplesByType[type][uri], keys[type]);
      }
    }
    console.log(processedModels);
    await this.processAgendapoints(processedModels);
    await this.processVotes(processedModels);
    await this.processBehandelings(processedModels);
    await this.processMeetings(processedModels);
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
    const resultObject = {};
    for(let triple of triples) {
      const key = triplesMap[triple.predicate];
      if(!key) continue;
      if(resultObject[key] && resultObject[key] !== triple.object) {
        if(!Array.isArray(resultObject[key])) {
          resultObject[key] = [resultObject[key]];
        }
        if(!resultObject[key].includes(triple.object)) {  
          resultObject[key].push(triple.object);
        }
      } else {
        resultObject[key] = triple.object;
      }
    }
    return resultObject;
  }
  async processMeetings(models) {
    const zittingType = 'http://data.vlaanderen.be/ns/besluit#Zitting';
    for(let uri in models[zittingType]) {
      const zittingRecord = await this.store.createRecord('zitting', {});
      const zittingData = models[zittingType][uri];
      await this.linkMandataris(zittingData, 'aanwezigenBijStart', true);
      await this.linkMandataris(zittingData, 'afwezigenBijStart', true);
      await this.linkMandataris(zittingData, 'voorzitter');
      await this.linkMandataris(zittingData, 'secretaris');
      await this.linkModels(zittingData, 'agendapunten', 'http://data.vlaanderen.be/ns/besluit#Agendapunt', models, true);
      const bestuursorgaanQuery = await this.store.query('bestuursorgaan', {
        'filter[:uri:]': zittingData.bestuursorgaan
      });
      zittingData.bestuursorgaan = bestuursorgaanQuery.firstObject;
      for(let key in zittingData) {
        if(Array.isArray(zittingData[key])) {
          for(let record of zittingData[key]) {
            zittingRecord[key].pushObject(record);
          }
        } else {
          if(zittingData[key]) {
            zittingRecord[key] = zittingData[key];
          }
        }
      }
      console.log(zittingRecord)
      await zittingRecord.save();
      console.log(zittingRecord);
    }
  }

  async linkMandataris(data, key, isArray) {
    const previousData = data[key];
    if(isArray) {
      data[key] = [];
    }
    if(Array.isArray(previousData)) {
      for(let uri of previousData) {
        const mandatarisData = await this.store.query('mandataris', {
          'filter[:uri:]': uri
        });
        const mandataris = mandatarisData.firstObject;
        if(mandataris) {
          data[key].push(mandataris);
        }
      }
    } else {
      const mandatarisData = await this.store.query('mandataris', {
        'filter[:uri:]': data[key]
      });
      if(isArray) {
        data[key].push(mandatarisData.firstObject);
      } else {
        data[key] = mandatarisData.firstObject;
      }
      
    }
  }
  async processVotes(models) {
    const voteType = 'http://data.vlaanderen.be/ns/besluit#Stemming';
    for(let uri in models[voteType]) {
      const voteRecord = await this.store.createRecord('stemming', {});
      const voteData = models[voteType][uri];
      await this.linkMandataris(voteData, 'aanwezigen', true);
      await this.linkMandataris(voteData, 'stemmers', true);
      await this.linkMandataris(voteData, 'voorstanders', true);
      await this.linkMandataris(voteData, 'tegenstanders', true);
      await this.linkMandataris(voteData, 'onthouders', true);
      for(let key in voteData) {
        if(Array.isArray(voteData[key])) {
          for(let record of voteData[key]) {
            voteRecord[key].pushObject(record);
          }
        } else {
          if(voteData[key]) {
            voteRecord[key] = voteData[key];
          }
        }
      }
      models[voteType][uri] = voteRecord;
      await voteRecord.save();
      console.log(voteRecord);
    }
  }
  async processBehandelings(models) {
    const behandelingType = 'http://data.vlaanderen.be/ns/besluit#BehandelingVanAgendapunt';
    for(let uri in models[behandelingType]) {
      const behandelingRecord = await this.store.createRecord('behandeling-van-agendapunt', {});
      const behandelingData = models[behandelingType][uri];
      await this.linkMandataris(behandelingData, 'aanwezigen', true);
      await this.linkMandataris(behandelingData, 'afwezigen', true);
      await this.linkMandataris(behandelingData, 'voorzitter');
      await this.linkMandataris(behandelingData, 'secretaris');
      await this.linkModels(behandelingData, 'stemmingen', 'http://data.vlaanderen.be/ns/besluit#Stemming', models, true);
      await this.linkModels(behandelingData, 'onderwerp', 'http://data.vlaanderen.be/ns/besluit#Agendapunt', models);
      for(let key in behandelingData) {
        if(Array.isArray(behandelingData[key])) {
          for(let record of behandelingData[key]) {
            behandelingRecord[key].pushObject(record);
          }
        } else {
          if(behandelingData[key]) {
            behandelingRecord[key] = behandelingData[key];
          }
        }
      }
      models[behandelingType][uri] = behandelingRecord;
      await behandelingRecord.save();
      console.log(behandelingRecord);
    }
  }
  async processAgendapoints(models){
    const agendapointType = 'http://data.vlaanderen.be/ns/besluit#Agendapunt';
    for(let uri in models[agendapointType]) {
      const agendapointRecord = await this.store.createRecord('agendapunt', {});
      const agendapointData = models[agendapointType][uri];
      for(let key in agendapointData) {
        if(Array.isArray(agendapointData[key])) {
          for(let record of agendapointData[key]) {
            agendapointRecord[key].pushObject(record);
          }
        } else {
          if(agendapointData[key]) {
            agendapointRecord[key] = agendapointData[key];
          }
        }
      }
      models[agendapointType][uri] = agendapointRecord;
      await agendapointRecord.save();
      console.log(agendapointRecord);
    }
  }
  async linkModels(data, key, modelType, models, isArray) {
    const previousData = data[key];
    if(isArray) {
      data[key] = [];
    }
    if(Array.isArray(previousData)) {
      for(let uri of previousData) {
        const model = models[modelType][uri];
        if(model) {
          data[key].push(model);
        }
      }
    } else {
      const model = models[modelType][previousData];
      if(isArray) {
        console.log(model);
        data[key].push(model);
      } else {
        data[key] = model;
      }
      
    }
  }
}