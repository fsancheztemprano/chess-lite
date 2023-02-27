export enum CurrentUserRelations {
  CURRENT_USER_REL = 'current-user',
  UPDATE_PROFILE_REL = 'updateProfile',
  CHANGE_PASSWORD_REL = 'changePassword',
  UPLOAD_AVATAR_REL = 'uploadAvatar',
  DELETE_ACCOUNT_REL = 'deleteProfile',
  USER_PREFERENCES_REL = 'user-preferences',
  UPDATE_PREFERENCES_REL = 'updatePreferences',
}

export enum UserManagementRelations {
  USER_MANAGEMENT_REL = 'user-management',
  USER_REL = 'user',
  USERS_REL = 'users',
  USER_MODEL_LIST_REL = 'userModels',
  USER_CREATE_REL = 'create',
  USER_UPDATE_REL = 'update',
  USER_UPDATE_ROLE_REL = 'updateRole',
  USER_UPDATE_AUTHORITIES_REL = 'updateAuthorities',
  USER_DELETE_REL = 'delete',
  USER_PREFERENCES_REL = 'user-preferences',
}

export enum RoleManagementRelations {
  ROLE_MANAGEMENT_REL = 'role-management',
  ROLE_REL = 'role',
  ROLES_REL = 'roles',
  ROLE_MODEL_LIST_REL = 'roleModels',
  ROLE_CREATE_REL = 'create',
  ROLE_UPDATE_REL = 'update',
  ROLE_DELETE_REL = 'delete',
}

export enum AuthorityManagementRelations {
  AUTHORITIES_REL = 'authorities',
  AUTHORITY_MODEL_LIST_REL = 'authorityModels',
}

export enum AdministrationRelations {
  ADMINISTRATION_REL = 'administration',
  SERVICE_LOGS_REL = 'service-logs',
  DELETE_SERVICE_LOGS_REL = 'deleteServiceLogs',
}

export enum AuthRelations {
  LOGIN_RELATION = 'login',
  TOKEN_RELATION = 'token',
  SIGNUP_RELATION = 'signup',
}

export enum ActivationTokenRelations {
  REQUEST_ACTIVATION_TOKEN_REL = 'requestActivationToken',
  ACTIVATION_TOKEN_REL = 'activation-token',
  ACTIVATE_ACCOUNT_REL = 'activateAccount',
  ACTIVATE_ACCOUNT_LINK = 'activate-account',
}

export enum ServiceLogsRelations {
  SERVICE_LOGS_REL = 'service-logs',
}

export enum GlobalSettingsRelations {
  GLOBAL_SETTINGS_REL = 'global-settings',
  GLOBAL_SETTINGS_UPDATE_REL = 'update',
}

export enum BuildInfoRelations {
  BUILD_INFO_REL = 'build-info',
}

export enum ThemeRelations {
  THEME_REL = 'theme',
}

export enum TicTacToeRelations {
  TIC_TAC_TOE_REL = 'tic-tac-toe',
  TIC_TAC_TOE_GAME_REL = 'game',
  TIC_TAC_TOE_GAMES_REL = 'games',
  TIC_TAC_TOE_MOVE_REL = 'move',
  TIC_TAC_TOE_MOVES_REL = 'moves',
  TIC_TAC_TOE_GAME_CREATE_REL = 'create',
  TIC_TAC_TOE_GAME_STATUS_REL = 'status',
}
