import { createServer, JSONAPISerializer } from 'miragejs';
import models from './models';
import factories from './factories';
import { unwrap } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/option';

export function setupServer({ environment = 'test' }) {
  return createServer({
    environment,
    serializers: {
      application: JSONAPISerializer,
    },
    models,
    factories,
    routes() {
      this.get('/ar-designs', (schema) => {
        const designs = schema.all('arDesign');
        return designs;
      });
      this.get('/ar-designs/:id/measures', (schema, request) => {
        const arDesign = schema.find('arDesign', unwrap(request.params['id']));
        return arDesign?.measures ?? [];
      });
      // Allow unhandled requests on the current domain to pass through
      this.passthrough();
    },

    seeds(server) {
      server.createList('arDesign', 20).forEach((design) => {
        server.createList('measure', 3, { design });
      });
    },
  });
}
