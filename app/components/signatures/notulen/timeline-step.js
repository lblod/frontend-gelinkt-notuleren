import Component from '@glimmer/component';

export default class SignaturesNotulenTimelineStep extends Component {
  get containerElement() {
    return document.getElementById(this.args.behandelingContainerId);
  }

  get mockNotulen() {
    return {
      body: this.args.notulen.content,
      signedId: this.args.notulen.zitting.get('id')
    };
  }
}
