import Service from '@ember/service';
import {analyse} from '@lblod/marawa/rdfa-context-scanner';
import { inject as service } from '@ember/service';
import {DRAFT_STATUS_ID, DRAFT_FOLDER_ID} from '../utils/constants';
import DomPurify from 'dompurify';

const MEETING_TYPE = 'http://data.vlaanderen.be/ns/besluit#Zitting';
const AGENDAPOINT_TYPE = 'http://data.vlaanderen.be/ns/besluit#Agendapunt';
const TREATMENT_TYPE = 'http://data.vlaanderen.be/ns/besluit#BehandelingVanAgendapunt';
const VOTING_TYPE = 'http://data.vlaanderen.be/ns/besluit#Stemming';

const keys = {
  [MEETING_TYPE]: {
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
  [AGENDAPOINT_TYPE]: {
    'http://purl.org/dc/terms/title': 'titel',
    'http://purl.org/dc/terms/description': 'beschrijving',
    'http://data.vlaanderen.be/ns/besluit#geplandOpenbaar': 'geplandOpenbaar',
  },
  [TREATMENT_TYPE]: {
    'http://data.vlaanderen.be/ns/besluit#openbaar': 'openbaar',
    'http://data.vlaanderen.be/ns/besluit#heeftStemming': 'stemmingen',
    'http://data.vlaanderen.be/ns/besluit#heeftAanwezige': 'aanwezigen',
    'http://mu.semte.ch/vocabularies/ext/heeftAfwezige': 'afwezigen',
    'http://data.vlaanderen.be/ns/besluit#heeftVoorzitter': 'voorzitter',
    'http://data.vlaanderen.be/ns/besluit#heeftSecretaris': 'secretaris',
    'http://purl.org/dc/terms/subject': 'onderwerp'
  },
  [VOTING_TYPE]: {
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
  @service currentSession;
  processedModels = {};
  meeting;

  extractTriplesFromHTML(htmlString) {
    const parser = new DOMParser();
    const document = parser.parseFromString(htmlString, "text/html");
    const node = document.body;
    const contexts = analyse(node).map((c) => c.context);
    const triples = this.cleanupTriples(contexts.flat());
    return {triples, node};
  }
  async importDocument(html) {
    const {triples, node} = this.extractTriplesFromHTML(html);

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
    await this.processAgendapoints(processedModels);
    await this.processVotes(processedModels);
    await this.processBehandelings(processedModels, node);
    await this.processMeetings(processedModels);

    for(let uri in processedModels[MEETING_TYPE]) {
      this.meeting = processedModels[MEETING_TYPE][uri];
      break;
    }
    //Validation
    await this.validateMeeting(this.meeting);
    //await this.validateAgendapointsAndBehandelings(processedModels);
    this.processedModels = processedModels;
    
    
  }
  async confirmImport(){
    await this.saveModel(this.processedModels, MEETING_TYPE);
    await this.saveModel(this.processedModels, AGENDAPOINT_TYPE);
    await this.saveModel(this.processedModels, VOTING_TYPE);
    await this.saveModel(this.processedModels, TREATMENT_TYPE);
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
      let value = triple.object;
      if(triple.datatype === 'http://www.w3.org/2001/XMLSchema#dateTime') {
        value = new Date(triple.object);
        if(isNaN(value)) {
          //Date is invalid
          continue;
        }
      } else if(triple.datatype === 'http://www.w3.org/2001/XMLSchema#boolean') {
        value = Boolean(triple.object);
      } else if(triple.datatype === 'http://www.w3.org/2001/XMLSchema#integer') {
        value = Number(triple.object);
      }
      if(resultObject[key] && resultObject[key] !== value) {
        if(!Array.isArray(resultObject[key])) {
          resultObject[key] = [resultObject[key]];
        }
        if(!resultObject[key].includes(value)) {  
          resultObject[key].push(value);
        }
      } else {
        resultObject[key] = value;
      }
    }
    return resultObject;
  }
  async processMeetings(models) {
    for(let uri in models[MEETING_TYPE]) {
      const zittingRecord = await this.store.createRecord('zitting', {});
      const zittingData = models[MEETING_TYPE][uri];
      await this.linkMandataris(zittingData, 'aanwezigenBijStart', true);
      await this.linkMandataris(zittingData, 'afwezigenBijStart', true);
      await this.linkMandataris(zittingData, 'voorzitter');
      await this.linkMandataris(zittingData, 'secretaris');
      await this.linkModels(zittingData, 'agendapunten', AGENDAPOINT_TYPE, models, true);
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
      models[MEETING_TYPE][uri] = zittingRecord;
    }
  }

  async linkMandataris(data, key, isArray) {
    const previousData = data[key];
    if(isArray) {
      data[key] = [];
    }
    if(Array.isArray(previousData)) {
      for(let uri of previousData) {
        try {
          const mandatarisData = await this.store.query('mandataris', {
            'filter[:uri:]': uri
          });
          const mandataris = mandatarisData.firstObject;
          if(mandataris) {
            data[key].push(mandataris);
          }
        } catch(e) {
          console.log(e);
        }
      }
    } else {
      try {
        const mandatarisData = await this.store.query('mandataris', {
          'filter[:uri:]': data[key]
        });
        if(isArray) {
          data[key].push(mandatarisData.firstObject);
        } else {
          data[key] = mandatarisData.firstObject;
        }
      } catch(e) {
        console.log(e);
      }
    }
  }
  async processVotes(models) {
    for(let uri in models[VOTING_TYPE]) {
      const voteRecord = await this.store.createRecord('stemming', {});
      const voteData = models[VOTING_TYPE][uri];
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
      models[VOTING_TYPE][uri] = voteRecord;
    }
  }
  async processBehandelings(models, htmlNode) {
    for(let uri in models[TREATMENT_TYPE]) {
      const behandelingRecord = await this.store.createRecord('behandeling-van-agendapunt', {});
      const behandelingData = models[TREATMENT_TYPE][uri];
      await this.linkMandataris(behandelingData, 'aanwezigen', true);
      await this.linkMandataris(behandelingData, 'afwezigen', true);
      await this.linkMandataris(behandelingData, 'voorzitter');
      await this.linkMandataris(behandelingData, 'secretaris');
      await this.linkModels(behandelingData, 'stemmingen', VOTING_TYPE, models, true);
      await this.linkModels(behandelingData, 'onderwerp', AGENDAPOINT_TYPE, models);
      behandelingData.documentContainer = await this.buildDocument(htmlNode, uri);
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
      models[TREATMENT_TYPE][uri] = behandelingRecord;
    }
  }
  async processAgendapoints(models){
    for(let uri in models[AGENDAPOINT_TYPE]) {
      const agendapointRecord = await this.store.createRecord('agendapunt', {});
      const agendapointData = models[AGENDAPOINT_TYPE][uri];
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
      models[AGENDAPOINT_TYPE][uri] = agendapointRecord;
    }
  }
  async linkModels(data, key, modelType, models, isArray) {
    
    const previousData = data[key];
    if(isArray) {
      data[key] = [];
    }
    if(Array.isArray(previousData)) {
      for(let uri of previousData) {
        if(!models[modelType]) continue;
        const model = models[modelType][uri];
        if(model) {
          data[key].push(model);
        }
      }
    } else {
      let model;
      if(models[modelType]) {
        model = models[modelType][previousData];
      }
      if(isArray) {
        if(model) {
          data[key].push(model);
        }
      } else {
        data[key] = model;
      }
      
    }
  }
  async saveModel(models, modelType) {
    for(let uri in models[modelType]) {
      const record = models[modelType][uri];
      await record.save();
    }
  }
  async buildDocument(htmlNode, uri) {
    const node = htmlNode.querySelector(`[resource="${uri}"]`);
    const documentHtml = this.removeUnnecessaryHTML(node);
    const status = await this.store.findRecord('concept', DRAFT_STATUS_ID);
    const folder = await this.store.findRecord('editor-document-folder', DRAFT_FOLDER_ID);
    const currentDate = new Date();
    const editorDocument = this.store.createRecord('editor-document', {content: documentHtml, createdOn: currentDate, updatedOn: currentDate});
    const documentContainer = this.store.createRecord('document-container', {status, folder});
    documentContainer.currentVersion = editorDocument;
    await editorDocument.save();
    await documentContainer.save();
    return documentContainer;
  }
  removeUnnecessaryHTML(node) {
    node.normalize();

    const LIMITED_SAFE_TAGS = ['a', 'p', 'br', 'ol', 'ul', 'li', 'strong', 'u', 'em', 's', 'b', 'table', 'thead', 'tbody', 'th', 'tr', 'td', 'div', 'span'];
    const DEFAULT_URI_SAFE_ATTRIBUTES = ['about', 'property', 'datatype', 'typeof', 'resource', 'vocab', 'prefix'];
    const DEFAULT_SAFE_ATTRIBUTES = ['colspan', 'rowspan', 'title', 'alt', 'cellspacing', 'axis', 'about', 'property', 'datatype', 'typeof', 'resource', 'rel', 'rev', 'content', 'vocab', 'prefix', 'href', 'src'];
    const propertiesToRemove = ['besluit:openbaar', 'dc:subject', 'ext:aanwezigenTable', 'ext:stemmingTable'];

    for(let child of node.children) {
      const property = child.getAttribute('property');
      if(propertiesToRemove.includes(property)) {
        node.removeChild(child);
      }
    }
    console.log(node)
    const cleanedHtml = DomPurify.sanitize(node.innerHTML, {ALLOWED_TAGS: LIMITED_SAFE_TAGS, ALLOWED_ATTR: DEFAULT_SAFE_ATTRIBUTES, ADD_URI_SAFE_ATTR: DEFAULT_URI_SAFE_ATTRIBUTES});
    return cleanedHtml;
  }
  validateAgendapointsAndBehandelings(models) {
    const agendapointsWithBehandeling = [];

    for(let uri in models[TREATMENT_TYPE]) {
      const behandelingModel = models[TREATMENT_TYPE][uri];
      if(behandelingModel.onderwerp) {
        agendapointsWithBehandeling.push(behandelingModel.onderwerp);
      } else {
        const agendapunt = this.store.createRecord("agendapunt", {
          geplandOpenbaar: behandelingModel.openbaar,
        });
        models[AGENDAPOINT_TYPE][`http://new-agendapoint/for/${behandelingModel.id}`] = agendapunt;
        behandelingModel.onderwerp = agendapunt;
        agendapointsWithBehandeling.push(agendapunt);
      }
    }
    
    for(let uri in models[AGENDAPOINT_TYPE]) {
      const agendapoint = models[AGENDAPOINT_TYPE][uri];
      if(!agendapointsWithBehandeling.includes(agendapoint)) {
        models[TREATMENT_TYPE][`http://new-behandeling/for/${agendapoint.id}`] = this.store.createRecord("behandeling-van-agendapunt", {
          openbaar: agendapoint.geplandOpenbaar,
          onderwerp: agendapoint,
        });
      }
    }
  }
  async validateMeeting(meeting) {
    const bestuursorgaan = meeting.bestuursorgaan;
    let currentAdministrativeUnitId = this.currentSession.group.id;
    if(bestuursorgaan) {
      const anotherBestuursorgaan = await bestuursorgaan.get('isTijdsspecialisatieVan');
      const bestuurseenheid = await anotherBestuursorgaan.get('bestuurseenheid');
      if(bestuurseenheid.get('id') !== currentAdministrativeUnitId) {
        throw new Error('Can\'t import meeting because you are not in the correct administrative unit');
      }
    }
  }
  reset() {
    this.processedModels = {};
    this.meeting = undefined;
  }
  async importTreatment(htmlString) {
    const parser = new DOMParser();
    const document = parser.parseFromString(htmlString, "text/html");
    const rootNode = document.body;
    const behandelingNode = rootNode.querySelector('[typeof="besluit:BehandelingVanAgendapunt"]');
    
    const cleanedHtml = this.removeUnnecessaryHTML(behandelingNode);
    
    const editorDocument = this.store.createRecord('editor-document');
    editorDocument.title = 'imported';
    editorDocument.content = cleanedHtml;
    editorDocument.createdOn = new Date();
    editorDocument.updatedOn = new Date();
    await editorDocument.save();

    const documentContainer = this.store.createRecord('document-container');
    documentContainer.currentVersion = editorDocument;
    documentContainer.status = await this.store.findRecord('concept', DRAFT_STATUS_ID);
    documentContainer.folder = await this.store.findRecord('editor-document-folder', DRAFT_FOLDER_ID);
    documentContainer.publisher = this.currentSession.group;
    await documentContainer.save();
  }
}