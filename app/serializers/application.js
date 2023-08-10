import JSONAPISerializer from '@ember-data/serializer/json-api';
// eslint-disable-next-line ember/no-mixins
import DataTableSerializerMixin from 'ember-data-table/mixins/serializer';

export default class ApplicationSerializer extends JSONAPISerializer.extend(
  DataTableSerializerMixin,
) {
  normalizeResponse(store, model, payload, id, requestType) {
    if (
      payload &&
      payload.data &&
      payload.data.relationships &&
      payload.data.relationships.treatment
    ) {
      payload.data.relationships['behandeling-van-agendapunt'] =
        payload.data.relationships.treatment;
      payload.data.relationships.treatment = undefined;
    }
    return super.normalizeResponse(store, model, payload, id, requestType);
  }

  serializeAttribute(snapshot, json, key, attributes) {
    if (key !== 'uri')
      super.serializeAttribute(snapshot, json, key, attributes);
  }
}
