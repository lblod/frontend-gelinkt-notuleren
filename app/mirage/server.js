import { createServer } from 'miragejs';

export function setupServer({ environment = 'test' }) {
  return createServer({
    environment,

    routes() {
      // Allow unhandled requests on the current domain to pass through
      this.passthrough();
    },
  });
}
