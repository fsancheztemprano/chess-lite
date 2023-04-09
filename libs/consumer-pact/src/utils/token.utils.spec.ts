import {
  AdminAuthority,
  AuthorityAuthority,
  GlobalSettingsAuthority,
  ProfileAuthority,
  RoleAuthority,
  ServiceLogsAuthority,
  TicTacToeAuthority,
  TokenAuthority,
  UserAuthority,
  UserPreferencesAuthority,
} from '@app/ui/shared/domain';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { jwtToken, setToken } from './token.utils';

describe('Token Utils', () => {
  it('should create jwt token', () => {
    const authenticatedUser = {
      user: { id: '51236253-7c7c-45e4-b7f5-304b3b66a43d', username: 'admin' },
      authorities: [
        AuthorityAuthority.AUTHORITY_CREATE,
        AuthorityAuthority.AUTHORITY_READ,
        AuthorityAuthority.AUTHORITY_UPDATE,
        AuthorityAuthority.AUTHORITY_DELETE,
        GlobalSettingsAuthority.GLOBAL_SETTINGS_READ,
        GlobalSettingsAuthority.GLOBAL_SETTINGS_UPDATE,
        ProfileAuthority.PROFILE_READ,
        ProfileAuthority.PROFILE_UPDATE,
        ProfileAuthority.PROFILE_DELETE,
        RoleAuthority.ROLE_CREATE,
        RoleAuthority.ROLE_READ,
        RoleAuthority.ROLE_UPDATE,
        RoleAuthority.ROLE_UPDATE_CORE,
        RoleAuthority.ROLE_DELETE,
        ServiceLogsAuthority.SERVICE_LOGS_READ,
        ServiceLogsAuthority.SERVICE_LOGS_DELETE,
        TokenAuthority.TOKEN_REFRESH,
        UserAuthority.USER_CREATE,
        UserAuthority.USER_READ,
        UserAuthority.USER_UPDATE,
        UserAuthority.USER_UPDATE_ROLE,
        UserAuthority.USER_UPDATE_AUTHORITIES,
        UserAuthority.USER_DELETE,
        UserPreferencesAuthority.USER_PREFERENCES_READ,
        UserPreferencesAuthority.USER_PREFERENCES_UPDATE,
        AdminAuthority.ADMIN_ROOT,
        AdminAuthority.ADMIN_ROLE_MANAGEMENT_ROOT,
        AdminAuthority.ADMIN_USER_MANAGEMENT_ROOT,
        TicTacToeAuthority.TIC_TAC_TOE_ROOT,
        TicTacToeAuthority.TIC_TAC_TOE_GAME_CREATE,
        TicTacToeAuthority.TIC_TAC_TOE_GAME_READ,
        TicTacToeAuthority.TIC_TAC_TOE_GAME_MOVE,
      ],
    };
    const token = jwtToken(authenticatedUser);
    expect(token).toBeTruthy();

    const decodedToken: JwtPayload = <JwtPayload>jwt.verify(token, 'secret', { algorithms: ['HS512'] });

    expect(decodedToken).toBeTruthy();
    expect(decodedToken.user).toStrictEqual(authenticatedUser.user);
    expect(decodedToken.authorities).toStrictEqual(authenticatedUser.authorities);
  });

  it('should set token in local storage', () => {
    const authenticatedUser = {
      user: { id: '51236253-7c7c-45e4-b7f5-304b3b66a43d', username: 'admin' },
    };
    setToken(authenticatedUser);
    expect(localStorage.getItem('token')).toBeTruthy();
    expect(localStorage.getItem('token')).toBe(jwtToken(authenticatedUser));
  });
});
