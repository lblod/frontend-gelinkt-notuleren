import Component from '@glimmer/component';
import {task} from "ember-concurrency";
import {action} from '@ember/object';
import {inject as service} from '@ember/service';
import {tracked} from 'tracked-built-ins';
import DomPurify from 'dompurify';
import { DRAFT_FOLDER_ID, DRAFT_STATUS_ID } from 'frontend-gelinkt-notuleren/utils/constants';

export default class ImportWizardImportDraftComponent extends Component {
  @tracked selectedImport;
  @tracked htmlString;
  @tracked url;
  @tracked ready=false;
  @service store;
  @service router;
  @service currentSession;
  @action 
  selectImport(event){
    this.selectedImport=event.target.value;
    this.ready=false;
  }
  
  @task
  *upload(event){
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.onload=e=>{
      this.htmlString=e.target.result;
      this.sanitizeHtml();
    }
    if (file) {
      yield reader.readAsText(file);
    } 
  }

  @action
  updateUrl(event){
    this.url=event.target.value
    this.ready=false;
  }

  @task
  *fetchHtml(){
    const options={
      method: 'POST'
    }
    const response=yield fetch("/cors-proxy?url="+this.url, options)
    this.htmlString=yield response.text();
    this.sanitizeHtml();
  }

  @action
  sanitizeHtml(){
    const parser = new DOMParser();
    const doc = parser.parseFromString(this.htmlString, "text/html");
    this.htmlString = doc.documentElement.outerHTML
    this.ready=true;
    console.log(this.htmlString);
  };

  @task
  *createDoc(){
    const LIMITED_SAFE_TAGS = ['a', 'p', 'br', 'ol', 'ul', 'li', 'strong', 'u', 'em', 's', 'b', 'table', 'thead', 'tbody', 'th', 'tr', 'td', 'div', 'span'];
    const DEFAULT_URI_SAFE_ATTRIBUTES = ['about', 'property', 'datatype', 'typeof', 'resource', 'vocab', 'prefix'];
    const DEFAULT_SAFE_ATTRIBUTES = ['colspan', 'rowspan', 'title', 'alt', 'cellspacing', 'axis', 'about', 'property', 'datatype', 'typeof', 'resource', 'rel', 'rev', 'content', 'vocab', 'prefix', 'href', 'src'];
    
    const parser = new DOMParser();
    const document = parser.parseFromString(this.htmlString, "text/html");
    const rootNode = document.body;
    rootNode.normalize();
    
    const cleanedHtml = DomPurify.sanitize(rootNode.innerHTML, {ALLOWED_TAGS: LIMITED_SAFE_TAGS, ALLOWED_ATTR: DEFAULT_SAFE_ATTRIBUTES, ADD_URI_SAFE_ATTR: DEFAULT_URI_SAFE_ATTRIBUTES});
    
    const editorDocument=this.store.createRecord('editor-document');
    editorDocument.title='imported'
    editorDocument.content = cleanedHtml;
    editorDocument.createdOn = new Date();
    editorDocument.updatedOn = new Date();
    yield editorDocument.save();

    const documentContainer = this.store.createRecord('document-container');
    documentContainer.currentVersion = editorDocument;
    documentContainer.status = yield this.store.findRecord('concept', DRAFT_STATUS_ID);
    documentContainer.folder = yield this.store.findRecord('editor-document-folder', DRAFT_FOLDER_ID);
    documentContainer.publisher = this.currentSession.group;
    yield documentContainer.save();

    this.args.toggleModal();

    this.router.transitionTo('inbox.agendapoints');
    
  }
}
