import Component from '@glimmer/component';
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";
import { task } from "ember-concurrency-decorators";
import { inject as service } from "@ember/service";

export default class ZittingTekstComponent extends Component {
  constructor(...args){
    super(...args);
    this.position=this.args.position;
    this.getText.perform();
  }
  
  @tracked position;
  @tracked text;
  
  @task
  *saveText(){
    const zitting=yield this.args.zitting;
    
    if(this.position==='intro'){
      zitting.intro=this.text;
    }
    else if(this.position==='outro'){
      zitting.outro=this.text;
    }
    yield zitting.save(); 
  }

  @task
  *getText(){
    const zitting=yield this.args.zitting;

    if(this.position==='intro'){
      this.text=yield zitting.intro;
    }
    else if(this.position==='outro'){
      this.text=yield zitting.outro;
    }
  }
}
