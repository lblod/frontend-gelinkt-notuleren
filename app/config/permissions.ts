import { AUTHORIZATION_ROLES } from 'frontend-gelinkt-notuleren/utils/constants';

const { READER, WRITER, PUBLISHER, SIGNER, DOCUMENT_MANAGER } =
  AUTHORIZATION_ROLES;

// NOTE: When adding a new permission: A good permission name is something that fits in the sentence:
// "Users of the <insert group>-group are allowed to <...>"

// Available permissions are:
// - read: (LEGACY) general reading permission for backwards compat
// - write: (LEGACY) general writing permission for backwards compat
// - publish: (LEGACY) general publishing permission for backwards compat
// - sign: (LEGACY) general signing permission for backwards compat
// - view-meetings
// - create-agendapoints

export const roles = [
  {
    name: READER,
    defaultRoute: 'inbox.meetings',
    permissions: [
      'read',
      'view-meetings',
      'create-agendapoints',
      'view-agendapoint-status',
      'view-agendapoint-linked-meeting',
    ],
  },
  {
    name: WRITER,
    defaultRoute: 'inbox.meetings',
    permissions: [
      'write',
      'view-meetings',
      'create-agendapoints',
      'view-agendapoint-status',
      'view-agendapoint-linked-meeting',
    ],
  },
  {
    name: PUBLISHER,
    defaultRoute: 'inbox.meetings',
    permissions: [
      'publish',
      'view-meetings',
      'create-agendapoints',
      'view-agendapoint-status',
      'view-agendapoint-linked-meeting',
    ],
  },
  {
    name: SIGNER,
    defaultRoute: 'inbox.meetings',
    permissions: [
      'sign',
      'view-meetings',
      'create-agendapoints',
      'view-agendapoint-status',
      'view-agendapoint-linked-meeting',
    ],
  },
  {
    name: DOCUMENT_MANAGER,
    defaultRoute: 'inbox.agendapoints',
    permissions: ['create-agendapoints'],
  },
] as const;

export type Permission = (typeof roles)[number]['permissions'][number];

export type AuthorizationRole =
  (typeof AUTHORIZATION_ROLES)[keyof typeof AUTHORIZATION_ROLES];

export function findGroupByRole(role: string) {
  return roles.find((r) => r.name === role);
}
