import DS from 'ember-data';
import DataTableSerializerMixin from 'ember-data-table/mixins/serializer';

export default DS.JSONAPISerializer.extend(DataTableSerializerMixin, {
    serializeAttribute(snapshot, json, key, attributes) {
    if (key !== 'uri')
      this._super(snapshot, json, key, attributes);
    }
});
