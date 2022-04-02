import { CurrentUserRelations, UserManagementRelations } from '@app/ui/shared/domain';
import { defaultTemplate } from '@app/ui/testing';
import { boolean, eachLike, iso8601DateTimeWithMillis, string, uuid } from '@pact-foundation/pact/src/dsl/matchers';

export const pactUser = {
  id: 'pactUserId',
  firstname: null,
  lastname: null,
  username: 'pactUser',
  email: 'pactUser@localhost',
  profileImageUrl: null,
  lastLoginDateDisplay: null,
  joinDate: iso8601DateTimeWithMillis(),
  role: {
    id: 'pactRoleId',
    name: 'PACT_ROLE',
    authorities: eachLike({ id: uuid(), name: string() }),
    coreRole: boolean(),
    canLogin: boolean(),
  },
  authorities: eachLike({ id: uuid(), name: string() }),
  active: true,
  locked: false,
  expired: false,
  credentialsExpired: false,
  userPreferences: {
    id: 'pactUserPreferencesId',
    darkMode: false,
    contentLanguage: 'en',
    _links: {
      [UserManagementRelations.USER_REL]: { href: 'http://localhost/api/user/pactUserId' },
      self: { href: 'http://localhost/api/user/preferences/pactUserPreferencesId' },
    },
    _templates: { ...defaultTemplate },
  },
  _links: {
    [UserManagementRelations.USERS_REL]: {
      href: 'http://localhost/api/user{?search}',
      templated: true,
    },
    [UserManagementRelations.USER_PREFERENCES_REL]: {
      href: 'http://localhost/api/user/preferences/pactUserPreferencesId',
    },
    self: {
      href: 'http://localhost/api/user/pactUserId',
    },
  },
  _templates: { ...defaultTemplate },
};

export const pactCurrentUser = {
  ...pactUser,
  userPreferences: {
    ...pactUser.userPreferences,
    _links: {
      [CurrentUserRelations.CURRENT_USER_REL]: {
        href: 'http://localhost/api/user/profile',
      },
      self: {
        href: 'http://localhost/api/user/profile/preferences',
      },
    },
  },
  _links: {
    [CurrentUserRelations.USER_PREFERENCES_REL]: {
      href: 'http://localhost/api/user/profile/preferences',
    },
    self: {
      href: 'http://localhost/api/user/profile',
    },
  },
};
