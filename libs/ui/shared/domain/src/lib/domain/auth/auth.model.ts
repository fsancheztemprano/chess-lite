import { HttpContextToken } from '@angular/common/http';

export interface LoginInput {
  username: string;
  password: string;
}

export interface SignupInput {
  username: string;
  email: string;
  firstname?: string;
  lastname?: string;
}

export enum HttpHeaderKey {
  ACCESS_CONTROL_EXPOSE_HEADERS = 'Access-Control-Expose-Headers',
  CONTENT_TYPE = 'Content-Type',
  JWT_TOKEN = 'Jwt-Token',
  JWT_REFRESH_TOKEN = 'Jwt-Refresh-Token',
  LOCATION = 'Location',
}

export interface AccountActivationInput {
  token: string;
  email: string;
  password: string;
}

export enum TokenKeys {
  TOKEN = 'token',
  REFRESH_TOKEN = 'refreshToken',
}

export const USE_REFRESH_TOKEN = new HttpContextToken<boolean>(() => false);

export enum DefaultRole {
  USER_ROLE = 'USER_ROLE',
  MOD_ROLE = 'MOD_ROLE',
  ADMIN_ROLE = 'ADMIN_ROLE',
  SUPER_ADMIN_ROLE = 'SUPER_ADMIN_ROLE',
}

export enum AuthorityAuthority {
  AUTHORITY_CREATE = 'authority:create',
  AUTHORITY_READ = 'authority:read',
  AUTHORITY_UPDATE = 'authority:update',
  AUTHORITY_DELETE = 'authority:delete',
}

export enum GlobalSettingsAuthority {
  GLOBAL_SETTINGS_READ = 'global:settings:read',
  GLOBAL_SETTINGS_UPDATE = 'global:settings:update',
}

export enum ProfileAuthority {
  PROFILE_READ = 'profile:read',
  PROFILE_UPDATE = 'profile:update',
  PROFILE_DELETE = 'profile:delete',
}

export enum RoleAuthority {
  ROLE_CREATE = 'role:create',
  ROLE_READ = 'role:read',
  ROLE_UPDATE = 'role:update',
  ROLE_UPDATE_CORE = 'role:update:core',
  ROLE_DELETE = 'role:delete',
}

export enum ServiceLogsAuthority {
  SERVICE_LOGS_READ = 'service:logs:read',
  SERVICE_LOGS_DELETE = 'service:logs:delete',
}

export enum TokenAuthority {
  TOKEN_REFRESH = 'token:refresh',
}

export enum UserAuthority {
  USER_CREATE = 'user:create',
  USER_READ = 'user:read',
  USER_UPDATE = 'user:update',
  USER_UPDATE_ROLE = 'user:update:role',
  USER_UPDATE_AUTHORITIES = 'user:update:authorities',
  USER_DELETE = 'user:delete',
}

export enum UserPreferencesAuthority {
  USER_PREFERENCES_READ = 'user:preferences:read',
  USER_PREFERENCES_UPDATE = 'user:preferences:update',
}

export enum AdminAuthority {
  ADMIN_ROOT = 'admin:root',
  ADMIN_USER_MANAGEMENT_ROOT = 'admin:user-management:root',
  ADMIN_ROLE_MANAGEMENT_ROOT = 'admin:role-management:root',
}

export enum TicTacToeAuthority {
  TIC_TAC_TOE_ROOT = 'tic-tac-toe:root',
  TIC_TAC_TOE_GAME_READ = 'tic-tac-toe:game:read',
  TIC_TAC_TOE_GAME_CREATE = 'tic-tac-toe:game:create',
  TIC_TAC_TOE_GAME_MOVE = 'tic-tac-toe:game:move',
}
