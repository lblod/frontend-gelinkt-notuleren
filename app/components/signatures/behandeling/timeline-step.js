import Component from '@glimmer/component';

export default class SignaturesBesluitenlijstTimelineStep extends Component {
  get mockBehandeling() {
    return {
      body: this.args.behandeling.content,
      signedId: this.args.behandeling.zitting.get('id')
    };
  }
}
