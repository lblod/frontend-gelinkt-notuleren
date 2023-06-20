import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { trackedFunction } from 'ember-resources/util/function';

export default class PublishingLogDocumentNameComponent extends Component {
  @tracked documentName;
  @tracked deleted;
  @tracked route;
  @tracked behandeling;
  @service intl;

  data = trackedFunction(this, async () => {
    const log = this.args.log;
    const logResource =
      (await log.signedResource) ?? (await log.publishedResource);
    let versionedResource;
    const agenda = await logResource.agenda;
    let route;
    let documentName;
    if (agenda) {
      versionedResource = agenda;
      const type = versionedResource.agendaType;
      switch (type) {
        case 'gepland':
          documentName = this.intl.t('meetings.publish.publication-actions.planned-agenda');
          break;
        case 'aanvullend':
          documentName = this.intl.t('meetings.publish.publication-actions.suplemental-agenda');
          break;
        case 'spoedeisend':
          documentName = this.intl.t('meetings.publish.publication-actions.urgent-agenda');
          break;
      }
      route = 'meetings.publish.agenda';
    } else {
      const versionedNotulen = await logResource.versionedNotulen;
      if (versionedNotulen) {
        documentName = this.intl.t('meetings.publish.publication-actions.notulen');
        versionedResource = versionedNotulen;
        route = 'meetings.publish.notulen';
      } else {
        const versionedBesluitenLijst =
          await logResource.versionedBesluitenLijst;
        if (versionedBesluitenLijst) {
          documentName = this.intl.t('meetings.publish.publication-actions.decision-list');
          versionedResource = versionedBesluitenLijst;
          route = 'meetings.publish.besluitenlijst';
        } else {
          const versionedBehandeling = logResource.versionedBehandeling;
          if (versionedBehandeling) {
            documentName = this.intl.t('meetings.publish.publication-actions.treatment');
            versionedResource = await logResource.versionedBehandeling;
            const behandeling = await versionedResource.behandeling;
            if (behandeling) {
              const onderwerp = await behandeling.onderwerp;
              documentName += ` [${onderwerp.titel}]`;
            }
            route = 'meetings.publish.uittreksels';
          }
        }
      }
    }
    const deleted = versionedResource.deleted;
    return {
      documentName,
      route,
      deleted,
    };
  });
}
