import JSONAPISerializer from '@ember-data/serializer/json-api';
import DataTableSerializerMixin from 'ember-data-table/mixins/serializer';

export default JSONAPISerializer.extend(DataTableSerializerMixin, {
    serializeAttribute(snapshot, json, key, attributes) {
    if (key !== 'uri')
      this._super(snapshot, json, key, attributes);
    }
});
