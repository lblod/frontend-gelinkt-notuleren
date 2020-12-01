import Component from '@glimmer/component';

export default class SignaturesNotulenTimelineStep extends Component {
  get mockNotulen() {
    return {
      body: this.args.notulen.content,
      signedId: this.args.notulen.zitting.get('id')
    };
  }
}