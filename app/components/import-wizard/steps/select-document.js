import Component from '@glimmer/component';
import {task} from "ember-concurrency";
import {action} from '@ember/object';
import {inject as service} from '@ember/service';
import {tracked} from 'tracked-built-ins';

export default class SelectDocumentComponent extends Component {
  @tracked selectedImport;
  @tracked htmlString;
  @tracked url;
  
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
    };
    if (file) {
      yield reader.readAsText(file);
    } 
  }

  @action
  updateUrl(event){
    this.url=event.target.value;
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
    this.htmlString = doc.documentElement.outerHTML;
    this.args.updateHtml(this.htmlString);
  }
}
