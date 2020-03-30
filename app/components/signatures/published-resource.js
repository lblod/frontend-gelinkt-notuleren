import Component from '@ember/component';
import { equal } from '@ember/object/computed';

export default Component.extend({
  tagName: '',
  submissionFailed: equal('signature.submissionStatus', 'http://lblod.data.gift/publication-submission-statuses/failure'),
  submissionSucceeded: equal('signature.submissionStatus', 'http://lblod.data.gift/publication-submission-statuses/success')
});
