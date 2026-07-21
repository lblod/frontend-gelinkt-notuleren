import { waitFor } from '@ember/test-waiters';
import BaseAuthenticator from 'ember-simple-auth/authenticators/base';

const basePath = '/vendor-login';
const contentType = 'application/json';
const supportedCredentials = 'same-origin';

type VendorLoginJson = {
    "@id": string,
    "@type": string,
    "account": string,
    "uuid": string,
    "created": {
        "@type": string,
        "@value": string
    }
}

export default class VendorLoginAuthenticator extends BaseAuthenticator {
  @waitFor
  async restore() {
    const url = `${basePath}/current`;
    const result = await fetch(url, {
      credentials: supportedCredentials,
      headers: new Headers({
        'Content-Type': contentType,
      }),
    });
    if (result.ok) return (await result.json()) as unknown;
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    else throw result;
  }

  @waitFor
  async authenticate(organization: string, username: string, key: string) {
    const result = await fetch(basePath, {
      method: 'POST',
      body: JSON.stringify({
        organization: organization,
        publisher: {
          uri: username,
          key: key,
        },
      }),
      credentials: supportedCredentials,
      headers: new Headers({
        'Content-Type': contentType,
      }),
    });
    if (result.ok) {
      return this.convertToDesideredFormat(
        await result.json(),
        organization,
      ) as unknown;
    }
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    else throw result;
  }

  @waitFor
  async invalidate() {
    const url = `${basePath}/current`;
    const result = await fetch(url, {
      method: 'DELETE',
      credentials: supportedCredentials,
      headers: new Headers({
        'Content-Type': contentType,
      }),
    });
    if (result.ok) return result;
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    else throw result;
  }
  convertToDesideredFormat(returnedJson: VendorLoginJson, organization: string) {
    const accountUuid = returnedJson.account.split('/').pop();
    const organizationUuid = organization.split('/').pop();
    return {
      links: {
        self: `${basePath}/current`,
      },
      data: {
        type: 'sessions',
        id: returnedJson.uuid,
        attributes: {
          roles: ['GelinktNotuleren-agent'],
        },
      },
      relationships: {
        account: {
          links: {
            related: `/accounts/${accountUuid}`,
          },
          data: {
            type: 'accounts',
            id: accountUuid,
          },
        },
        group: {
          links: {
            related: `/bestuurseenheden/${organizationUuid}`,
          },
          data: {
            type: 'bestuurseenheden',
            id: organizationUuid,
          },
        },
      },
    };
  }
}
