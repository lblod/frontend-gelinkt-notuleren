import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class MeetingsEditRoute extends Route {
  @service store;

  async model(params) {
    const zitting = await this.store.findRecord('zitting', params.id, {
      include:
        'bestuursorgaan,secretaris,voorzitter,intermissions,publicatie-agendas',
    });
    const publicationFilter = {
      filter: {
        state: 'gepubliceerd',
        zitting: {
          id: params.id,
        },
      },
    };
    const versionedNotulen = await this.store.query(
      'versioned-notulen',
      publicationFilter
    );
    const versionedBesluitenLijsten = await this.store.query(
      'versioned-besluiten-lijst',
      publicationFilter
    );
    const versionedBehandelingen = await this.store.query(
      'versioned-behandeling',
      publicationFilter
    );
    const agendas = await zitting.get('publicatieAgendas');
    const publishedResourcesCount =
      agendas.length +
      versionedBehandelingen.length +
      versionedBesluitenLijsten.length +
      versionedNotulen.length;
    return {
      zitting,
      publishedResourcesCount,
    };
  }
}
