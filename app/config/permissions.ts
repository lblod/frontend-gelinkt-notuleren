import { AUTHORIZATION_ROLES } from 'frontend-gelinkt-notuleren/utils/constants';

const { READER, WRITER, PUBLISHER, SIGNER, DOCUMENT_MANAGER } =
  AUTHORIZATION_ROLES;

// NOTE: When adding a new permission: A good permission name is something that fits in the sentence:
// "Users of the <insert group>-group are allowed to <...>"

export const roles = [
  // Bestuurseenheid reader
  {
    name: READER,
    defaultRoute: 'inbox.meetings',
    permissions: [
      'view-meetings',
      'view-agendapoint-status',
      'view-agendapoint-linked-meeting',
      'view-regulatory-statement-content',
    ],
  },
  // Bestuurseenheid writer
  {
    name: WRITER,
    defaultRoute: 'inbox.meetings',
    permissions: [
      'view-meetings',
      'create-agendapoints',
      'view-agendapoint-status',
      'view-agendapoint-linked-meeting',
      'edit-agendapoint-content',
      'edit-agendapoint-attachments',
      'edit-agendapoint-revisions',
      'create-regulatory-statements',
      'edit-regulatory-statement-content',
      'insert-editor-worship',
      'insert-editor-lmb',
      'set-default-municipality-in-location-insert',
    ],
  },
  {
    name: PUBLISHER,
    defaultRoute: 'inbox.meetings',
    permissions: [
      'view-meetings',
      'view-agendapoint-status',
      'view-agendapoint-linked-meeting',
    ],
  },
  {
    name: SIGNER,
    defaultRoute: 'inbox.meetings',
    permissions: [
      'view-meetings',
      'view-agendapoint-status',
      'view-agendapoint-linked-meeting',
    ],
  },
  {
    name: DOCUMENT_MANAGER,
    defaultRoute: 'inbox.agendapoints',
    permissions: [
      'create-agendapoints',
      'edit-agendapoint-content',
      'edit-agendapoint-attachments',
      'edit-agendapoint-revisions',
      'create-regulatory-statements',
      'view-regulatory-statement-content',
      'edit-regulatory-statement-content',
    ],
  },
] as const;

export type Permission = (typeof roles)[number]['permissions'][number];

export type AuthorizationRole =
  (typeof AUTHORIZATION_ROLES)[keyof typeof AUTHORIZATION_ROLES];

export function findGroupByRole(role: string) {
  return roles.find((r) => r.name === role);
}
