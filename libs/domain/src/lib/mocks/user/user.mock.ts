import { ActivationTokenRelations, UserManagementRelations } from '../../domain/hateoas/relations.enum';

export const updateUserTemplate = {
  [UserManagementRelations.USER_UPDATE_REL]: {
    method: 'PATCH',
    properties: [
      { name: 'active' },
      { name: 'authorityIds' },
      { name: 'credentialsExpired' },
      {
        name: 'email',
        type: 'email',
      },
      { name: 'expired' },
      { name: 'firstname', type: 'text' },
      { name: 'lastname', type: 'text' },
      { name: 'locked' },
      {
        name: 'password',
        minLength: 6,
        maxLength: 128,
        type: 'text',
      },
      { name: 'profileImageUrl', type: 'text' },
      { name: 'roleId', type: 'text' },
      {
        name: 'username',
        minLength: 5,
        maxLength: 128,
        type: 'text',
      },
    ],
  },
};

export const requestActivationTokenTemplate = {
  [ActivationTokenRelations.REQUEST_ACTIVATION_TOKEN_REL]: {
    method: 'POST',
    properties: [],
  },
};

export const deleteUserTemplate = {
  [UserManagementRelations.USER_DELETE_REL]: { method: 'DELETE', properties: [] },
};

export const updateUserRoleTemplate = {
  [UserManagementRelations.USER_UPDATE_ROLE_REL]: {
    method: 'PATCH',
    properties: [{ name: 'roleId', type: 'text' }],
    target: 'http://localhost/api/user/pactUserId/role',
  },
};

export const updateUserAuthoritiesTemplate = {
  [UserManagementRelations.USER_UPDATE_AUTHORITIES_REL]: {
    method: 'PATCH',
    properties: [{ name: 'authorityIds' }],
    target: 'http://localhost/api/user/pactUserId/authorities',
  },
};

export const createUserTemplate = {
  [UserManagementRelations.USER_CREATE_REL]: {
    method: 'POST',
    properties: [
      { name: 'active' },
      { name: 'authorityIds' },
      { name: 'credentialsExpired' },
      {
        name: 'email',
        type: 'email',
      },
      { name: 'expired' },
      { name: 'firstname', type: 'text' },
      { name: 'lastname', type: 'text' },
      {
        name: 'locked',
      },
      { name: 'password', minLength: 6, maxLength: 128, type: 'text' },
      {
        name: 'profileImageUrl',
        type: 'text',
      },
      { name: 'roleId', type: 'text' },
      { name: 'username', minLength: 5, maxLength: 128, type: 'text' },
    ],
    target: 'http://localhost/api/user',
  },
};
