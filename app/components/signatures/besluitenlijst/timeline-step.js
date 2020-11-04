import Component from '@glimmer/component';

export default class SignaturesBesluitenlijstTimelineStep extends Component {
  get mockLijst() {
    return {
      body: this.args.lijst.content,
      signedId: this.args.lijst.zitting.get('id')
    };
  }
}