import Component from '@glimmer/component';

export default class SignaturesBesluitenlijstTimelineStep extends Component {
  get mockBehandeling() {
    return {
      body: this.args.extract.document.content,
      signedId: this.args.extract.document.zitting.get('id')
    };
  }
}
