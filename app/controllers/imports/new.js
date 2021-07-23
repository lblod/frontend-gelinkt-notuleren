import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from "ember-concurrency";

export default class ImportsNewController extends Controller {
  @tracked selectedType;
  @tracked selectedImport;
  @tracked htmlString;
  @tracked url;
  @tracked ready=false;
  @action 
  select(event){
    this.selectedType=event.target.value;
  }
  
  @action 
  selectImport(event){
    this.selectedImport=event.target.value;
  }
  
  @action
  upload(event){
    const reader = new FileReader();
    const file = event.target.files[0];
    if (file) {
      reader.readAsText(file);
    }
    reader.onload=e=>{
      this.htmlString=e.target.result;
      this.sanitizeHtml();
    }
  }

  @action
  updateUrl(event){
    this.url=event.target.value
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
  };
  
}
