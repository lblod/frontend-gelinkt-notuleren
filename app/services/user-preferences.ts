import Service from '@ember/service';
import { service } from '@ember/service';
import type CurrentSessionService from './current-session';
import type Store from './store';
import { CONCEPT_SCHEMES } from 'frontend-gelinkt-notuleren/config/constants';
import ConceptModel from 'frontend-gelinkt-notuleren/models/concept';
import UserPreferenceModel from 'frontend-gelinkt-notuleren/models/user-preference';
import z from 'zod';

const userPreferenceSchema = z.discriminatedUnion('key', [
  z.object({
    key: z.literal('favourite-templates'),
    value: z.array(z.string()).default([]),
  }),
  z.object({
    key: z.literal('meeting.sidebar.navigation.expanded'),
    value: z.coerce.boolean().default(true),
  }),
]);

type UserPreference = z.infer<typeof userPreferenceSchema>;
export default class UserPreferencesService extends Service {
  @service declare currentSession: CurrentSessionService;
  @service declare store: Store;

  get user() {
    const user = this.currentSession.user;
    if (!user) {
      throw new Error('User is not authenticated');
    }
    return user;
  }

  async _resolveConcept(key: UserPreference['key']) {
    const preferenceConcept = (
      await this.store.query<ConceptModel>('concept', {
        filter: {
          notation: key,
          'concept-schemes': {
            ':uri:': CONCEPT_SCHEMES.USER_PREFERENCES,
          },
        },
      })
    )[0];
    if (!preferenceConcept) {
      throw new Error(`Unable to find related concept for preference ${key}`);
    }
    return preferenceConcept;
  }

  async _fetchPreference(preferenceConcept: ConceptModel) {
    const preference = (
      await this.store.query<UserPreferenceModel>('user-preference', {
        filter: {
          type: {
            ':id:': preferenceConcept.id,
          },
          gebruiker: {
            ':id:': this.user.id,
          },
        },
      })
    )[0];
    return preference;
  }

  async _createPreference(preferenceConcept: ConceptModel, value?: string) {
    const preference = this.store.createRecord<UserPreferenceModel>(
      'user-preference',
      {
        type: preferenceConcept,
        gebruiker: this.user,
        value,
      },
    );
    await preference.save();
    return preference;
  }

  async load<K extends UserPreference['key']>(
    key: K,
  ): Promise<Extract<UserPreference, { key: K }>['value']> {
    const user = this.currentSession.user;
    if (!user) {
      throw new Error('User is not authenticated');
    }
    const preferenceConcept = await this._resolveConcept(key);
    const userPreference = await this._fetchPreference(preferenceConcept);

    // @ts-expect-error unsure how to correctly narrow this type
    return userPreferenceSchema.parse({
      key,
      value: userPreference?.value
        ? (JSON.parse(userPreference.value) as unknown)
        : null,
    }).value;
  }

  async save<K extends UserPreference['key']>(
    key: K,
    value: Extract<UserPreference, { key: K }>['value'],
  ) {
    const preferenceConcept = await this._resolveConcept(key);
    const userPreference = await this._fetchPreference(preferenceConcept);
    if (userPreference) {
      userPreference.value = JSON.stringify(value);
      await userPreference.save();
    } else {
      await this._createPreference(preferenceConcept, JSON.stringify(value));
    }
  }
}
