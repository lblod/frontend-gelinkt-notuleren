import Component from '@ember/component';

export default class SignaturesBesluitenlijstTimelineStep extends Component {
  get mocklijst() {
    return {
      body: this.args.lijst.renderedContent,
      signedId: this.args.lijst.zitting.get('id')
    };
  }
}