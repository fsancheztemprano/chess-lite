import { CurrentUserRelations } from '../../domain/hateoas/relations.enum';

export const updateProfilePreferencesTemplate = {
  [CurrentUserRelations.UPDATE_PREFERENCES_REL]: {
    method: 'PATCH',
    properties: [
      {
        name: 'contentLanguage',
        minLength: 2,
        maxLength: 2,
        type: 'text',
      },
      {
        name: 'darkMode',
      },
    ],
  },
};

export const updateProfileTemplate = {
  [CurrentUserRelations.UPDATE_PROFILE_REL]: {
    method: 'PATCH',
    properties: [
      {
        name: 'firstname',
        type: 'text',
      },
      {
        name: 'lastname',
        type: 'text',
      },
    ],
  },
};

export const uploadAvatarTemplate = {
  [CurrentUserRelations.UPLOAD_AVATAR_REL]: {
    method: 'PATCH',
    contentType: 'multipart/form-data',
    properties: [],
    target: 'http://localhost/api/user/profile/avatar',
  },
};

export const deleteProfileTemplate = {
  [CurrentUserRelations.DELETE_ACCOUNT_REL]: { method: 'DELETE', properties: [] },
};

export const changePasswordTemplate = {
  [CurrentUserRelations.CHANGE_PASSWORD_REL]: {
    method: 'PATCH',
    properties: [
      {
        name: 'newPassword',
        minLength: 8,
        maxLength: 128,
        type: 'text',
      },
      {
        name: 'password',
        minLength: 8,
        maxLength: 128,
        type: 'text',
      },
    ],
    target: 'http://localhost/api/user/profile/password',
  },
};
