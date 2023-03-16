import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { action } from '@ember/object';

export default class SignedResource extends Component {
  @tracked showDeleteSignatureCard = false;

  @action
  toggleDeleteSignatureCard() {
    this.showDeleteSignatureCard = !this.showDeleteSignatureCard;
  }
  @task
  *deleteSignature() {
    const signature = this.args.signature;
    signature.deleted = true;
    yield signature.save();
  }
}
