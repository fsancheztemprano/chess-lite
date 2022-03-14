import { UserManagementRelations } from '../../domain/hateoas/relations.enum';

export const updateUserPreferencesTemplate = {
  [UserManagementRelations.USER_UPDATE_REL]: {
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
