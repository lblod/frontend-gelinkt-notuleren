import Service from '@ember/service';
import { service } from '@ember/service';
import type StoreService from 'frontend-gelinkt-notuleren/services/gn-store';
import type ArDesign from 'frontend-gelinkt-notuleren/models/ar-design';
import type EditorDocumentModel from 'frontend-gelinkt-notuleren/models/editor-document';
import {
  DRAFT_STATUS_ID,
  PUBLISHED_STATUS_ID,
  SCHEDULED_STATUS_ID,
} from 'frontend-gelinkt-notuleren/utils/constants';
import type {
  DesignInfo,
  Pagination,
} from 'frontend-gelinkt-notuleren/components/editor-plugins/ar-importer/common-types';

export default class ArDesignLoaderService extends Service {
  @service declare store: StoreService;

  async findDesigns({
    pageNumber,
    pageSize,
    sort,
    nameFilter,
  }: Pagination): Promise<DesignInfo> {
    const designs = await this.store.query<ArDesign>('ar-design', {
      ...(nameFilter && {
        filter: {
          name: nameFilter,
        },
      }),
      page: {
        size: pageSize,
        number: pageNumber,
      },
      sort,
    });
    return {
      designs,
      inDocs: Object.fromEntries(
        designs.map((design) => [
          design.id ?? '',
          this.store
            .query<EditorDocumentModel>('editor-document', {
              filter: {
                'includes-ar-designs': design.uri,
                'document-container': {
                  'current-version': { 'includes-ar-designs': design.uri },
                  status: {
                    id: `${DRAFT_STATUS_ID},${SCHEDULED_STATUS_ID},${PUBLISHED_STATUS_ID}`,
                  },
                },
              },
              fields: { 'editor-documents': 'uri' },
            })
            .then((docs) => docs.length),
        ]),
      ),
    };
  }
}
