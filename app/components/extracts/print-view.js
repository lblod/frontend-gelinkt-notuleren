import Component from '@glimmer/component';
import { trackedFunction } from 'ember-resources/util/function';
import { inject as service } from '@ember/service';

export default class ExtractsPrintViewComponent extends Component {
  @service store;
  data = trackedFunction(this, async () => {
    const { versionedTreatment } = this.args;
    if (!versionedTreatment) {
      throw new Error('versionedTreatment is a required argument');
    }
    const meeting = await versionedTreatment.zitting;
    const signatures = await this.store.query('signed-resource', {
      'filter[versioned-behandeling][:id:]': versionedTreatment.id,
      'filter[:or:][deleted]': false,
      'filter[:or:][:has-no:deleted]': 'yes',
      sort: 'created-on',
    });
    const content = versionedTreatment.content;
    return { meeting, signatures, content };
  });

  get meeting() {
    return this.data.value?.meeting;
  }

  get content() {
    return this.data.value?.content;
  }

  get signatures() {
    return this.data.value?.signatures;
  }
}
