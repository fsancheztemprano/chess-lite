import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { CurrentUserRelations, TOKEN_KEY, User, UserPreferences } from '@app/domain';
import { defaultTemplate } from '@app/domain/mocks';
import { HalFormClientModule, HalFormService } from '@hal-form-client';
import { InteractionObject, Pact } from '@pact-foundation/pact';
import { stubMessageServiceProvider } from '../../../../../apps/app/src/app/core/services/message.service.stub';
import { stubPreferencesServiceProvider } from '../../../../../apps/app/src/app/core/services/preferences.service.stub';
import { UserService } from '../../../../../apps/app/src/app/core/services/user.service';
import { UserSettingsService } from '../../../../../apps/app/src/app/modules/user-settings/services/user-settings.service';
import {
  changePasswordTemplate,
  deleteProfileTemplate,
  updateProfilePreferencesTemplate,
  updateProfileTemplate,
} from '../../../../domain/src/lib/mocks/user/user-profile.mock';
import { avengersAssemble } from '../../interceptor/pact.interceptor';
import { pactForResource } from '../../utils/pact.utils';
import { jwtToken } from '../../utils/token.util';
import {
  ChangeUserProfilePasswordPact,
  DeleteUserProfilePact,
  GetUserProfilePact,
  GetUserProfilePreferencesPact,
  UpdateUserProfilePact,
  UpdateUserProfilePreferencesPact,
} from './user-profile.pact';
import { stubSessionServiceProvider } from '../../../../../apps/app/src/app/core/services/session.service.stub';

const provider: Pact = pactForResource('userProfile');

describe('User Profile Pact', () => {
  let userService: UserService;
  let userSettingsService: UserSettingsService;

  beforeAll(() => provider.setup());
  afterEach(() => provider.verify());
  afterAll(() => provider.finalize());

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HalFormClientModule],
      providers: [
        avengersAssemble(provider.mockService.baseUrl),
        stubMessageServiceProvider,
        stubPreferencesServiceProvider,
        stubSessionServiceProvider,
      ],
    });
    const halFormService = TestBed.inject(HalFormService);
    halFormService.setRootResource({
      _links: {
        self: {
          href: 'http://localhost/api',
        },
        'current-user': {
          href: 'http://localhost/api/user/profile',
        },
      },
      _templates: { ...defaultTemplate },
    });

    userService = TestBed.inject(UserService);
    userSettingsService = TestBed.inject(UserSettingsService);
  });

  describe('Get User Profile', () => {
    it('successful', (done) => {
      const interaction: InteractionObject = GetUserProfilePact.successful;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['profile:read'] }));
        userService.fetchCurrentUser().subscribe((response: User) => {
          expect(response).toBeTruthy();
          expect(response.id).toBe(interaction.willRespondWith.body.id);
          expect(response._links).toBeTruthy();
          expect(response._templates?.default).toBeTruthy();
          expect(response.userPreferences).toBeTruthy();
          expect(response.userPreferences?._templates).toBeTruthy();
          expect(response.userPreferences?._templates?.default).toBeTruthy();
          done();
        });
      });
    });

    it('with update', (done) => {
      const interaction: InteractionObject = GetUserProfilePact.with_update;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['profile:read', 'profile:update'] }));
        userService.fetchCurrentUser().subscribe((response: User) => {
          expect(response).toBeTruthy();
          expect(response.id).toBe(interaction.willRespondWith.body.id);
          expect(response._templates?.default).toBeTruthy();
          expect(response._templates?.[CurrentUserRelations.UPDATE_PROFILE_REL]).toBeTruthy();
          expect(response._templates?.[CurrentUserRelations.UPLOAD_AVATAR_REL]).toBeTruthy();
          expect(response._templates?.[CurrentUserRelations.CHANGE_PASSWORD_REL]).toBeTruthy();
          expect(response.userPreferences).toBeTruthy();
          expect(response.userPreferences?._templates).toBeTruthy();
          expect(response.userPreferences?._templates?.default).toBeTruthy();
          expect(response.userPreferences?._templates?.[CurrentUserRelations.UPDATE_PREFERENCES_REL]).toBeTruthy();
          done();
        });
      });
    });

    it('with delete', (done) => {
      const interaction: InteractionObject = GetUserProfilePact.with_delete;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['profile:read', 'profile:delete'] }));
        userService.fetchCurrentUser().subscribe((response: User) => {
          expect(response).toBeTruthy();
          expect(response.id).toBe(interaction.willRespondWith.body.id);
          expect(response._templates?.default).toBeTruthy();
          expect(response._templates?.[CurrentUserRelations.DELETE_ACCOUNT_REL]).toBeTruthy();
          done();
        });
      });
    });

    it('unauthorized', (done) => {
      const interaction: InteractionObject = GetUserProfilePact.unauthorized;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TOKEN_KEY, jwtToken());
        userService.fetchCurrentUser().subscribe({
          error: (error: HttpErrorResponse) => {
            expect(error).toBeTruthy();
            expect(error.status).toBe(interaction.willRespondWith.status);
            expect(error.error).toStrictEqual(interaction.willRespondWith.body);
            done();
          },
        });
      });
    });

    it('not found', (done) => {
      const interaction: InteractionObject = GetUserProfilePact.not_found;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TOKEN_KEY, jwtToken({ user: { id: 'notFoundId' }, authorities: ['profile:read'] }));
        userService.fetchCurrentUser().subscribe({
          error: (error: HttpErrorResponse) => {
            expect(error).toBeTruthy();
            expect(error.status).toBe(interaction.willRespondWith.status);
            expect(error.error).toStrictEqual(interaction.willRespondWith.body);
            done();
          },
        });
      });
    });
  });

  describe('Update User Profile', () => {
    beforeEach(() => {
      userService.setUser(
        new User({
          _links: { self: { href: 'http://localhost/api/user/profile' } },
          _templates: {
            ...defaultTemplate,
            ...updateProfileTemplate,
          },
        }),
      );
    });

    it('successful', (done) => {
      const interaction: InteractionObject = UpdateUserProfilePact.successful;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['profile:read', 'profile:update'] }));
        userSettingsService.updateProfile({ firstname: 'pactUserFirstname' }).subscribe((response: User) => {
          expect(response).toBeTruthy();
          expect(response.id).toBe(interaction.willRespondWith.body.id);
          expect(response._links).toBeTruthy();
          done();
        });
      });
    });

    it('unauthorized', (done) => {
      const interaction: InteractionObject = UpdateUserProfilePact.unauthorized;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TOKEN_KEY, jwtToken());
        userSettingsService.updateProfile({ firstname: 'pactUserFirstname' }).subscribe({
          error: (error: HttpErrorResponse) => {
            expect(error).toBeTruthy();
            expect(error.status).toBe(interaction.willRespondWith.status);
            expect(error.error).toStrictEqual(interaction.willRespondWith.body);
            done();
          },
        });
      });
    });

    it('not found', (done) => {
      const interaction: InteractionObject = UpdateUserProfilePact.not_found;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(
          TOKEN_KEY,
          jwtToken({
            user: { id: 'notFoundId' },
            authorities: ['profile:read', 'profile:update'],
          }),
        );
        userSettingsService.updateProfile({ firstname: 'pactUserFirstname' }).subscribe({
          error: (error: HttpErrorResponse) => {
            expect(error).toBeTruthy();
            expect(error.status).toBe(interaction.willRespondWith.status);
            expect(error.error).toStrictEqual(interaction.willRespondWith.body);
            done();
          },
        });
      });
    });
  });

  describe('Change User Profile Password', () => {
    beforeEach(() => {
      userService.setUser(
        new User({
          _links: { self: { href: 'http://localhost/api/user/profile' } },
          _templates: {
            ...defaultTemplate,
            ...changePasswordTemplate,
          },
        }),
      );
    });

    it('successful', (done) => {
      const interaction: InteractionObject = ChangeUserProfilePasswordPact.successful;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['profile:read', 'profile:update'] }));
        userSettingsService
          .changePassword({
            password: 'password',
            newPassword: 'newPassword',
          })
          .subscribe((response: User) => {
            expect(response).toBeTruthy();
            expect(response.id).toBe(interaction.willRespondWith.body.id);
            expect(response._links).toBeTruthy();
            done();
          });
      });
    });

    it('unauthorized', (done) => {
      const interaction: InteractionObject = ChangeUserProfilePasswordPact.unauthorized;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TOKEN_KEY, jwtToken());
        userSettingsService.changePassword({ password: 'password', newPassword: 'newPassword' }).subscribe({
          error: (error: HttpErrorResponse) => {
            expect(error).toBeTruthy();
            expect(error.status).toBe(interaction.willRespondWith.status);
            expect(error.error).toStrictEqual(interaction.willRespondWith.body);
            done();
          },
        });
      });
    });

    it('not found', (done) => {
      const interaction: InteractionObject = ChangeUserProfilePasswordPact.not_found;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(
          TOKEN_KEY,
          jwtToken({
            user: { id: 'notFoundId' },
            authorities: ['profile:read', 'profile:update'],
          }),
        );
        userSettingsService.changePassword({ password: 'password', newPassword: 'newPassword' }).subscribe({
          error: (error: HttpErrorResponse) => {
            expect(error).toBeTruthy();
            expect(error.status).toBe(interaction.willRespondWith.status);
            expect(error.error).toStrictEqual(interaction.willRespondWith.body);
            done();
          },
        });
      });
    });
  });

  describe('Delete User Profile', () => {
    beforeEach(() => {
      userService.setUser(
        new User({
          _links: { self: { href: 'http://localhost/api/user/profile' } },
          _templates: {
            ...defaultTemplate,
            ...deleteProfileTemplate,
          },
        }),
      );
    });

    it('successful', (done) => {
      const interaction: InteractionObject = DeleteUserProfilePact.successful;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(
          TOKEN_KEY,
          jwtToken({
            user: { id: 'pactUserId' },
            authorities: ['profile:read', 'profile:update'],
          }),
        );
        userSettingsService.deleteAccount().subscribe((response: User) => {
          expect(response).toBeTruthy();
          done();
        });
      });
    });

    it('unauthorized', (done) => {
      const interaction: InteractionObject = DeleteUserProfilePact.unauthorized;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TOKEN_KEY, jwtToken());
        userSettingsService.deleteAccount().subscribe({
          error: (error: HttpErrorResponse) => {
            expect(error).toBeTruthy();
            expect(error.status).toBe(interaction.willRespondWith.status);
            expect(error.error).toStrictEqual(interaction.willRespondWith.body);
            done();
          },
        });
      });
    });

    it('not found', (done) => {
      const interaction: InteractionObject = DeleteUserProfilePact.not_found;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(
          TOKEN_KEY,
          jwtToken({
            user: { id: 'notFoundId' },
            authorities: ['profile:read', 'profile:update'],
          }),
        );
        userSettingsService.deleteAccount().subscribe({
          error: (error: HttpErrorResponse) => {
            expect(error).toBeTruthy();
            expect(error.status).toBe(interaction.willRespondWith.status);
            expect(error.error).toStrictEqual(interaction.willRespondWith.body);
            done();
          },
        });
      });
    });
  });

  describe('Get User Profile Preferences', () => {
    beforeEach(() => {
      userService.setUser(
        new User({
          _links: {
            [CurrentUserRelations.USER_PREFERENCES_REL]: { href: 'http://localhost/api/user/profile/preferences' },
            self: { href: 'http://localhost/api/user/profile' },
          },
          _templates: { ...defaultTemplate },
        }),
      );
    });

    it('successful', (done) => {
      const interaction: InteractionObject = GetUserProfilePreferencesPact.successful;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TOKEN_KEY, jwtToken({ user: { id: 'pactUserId' }, authorities: ['profile:read'] }));
        userService.fetchUserPreferences().subscribe((response: User) => {
          expect(response).toBeTruthy();
          expect(response.id).toBe(interaction.willRespondWith.body.id);
          expect(response._links).toBeTruthy();
          expect(response._templates?.default).toBeTruthy();
          done();
        });
      });
    });

    it('unauthorized', (done) => {
      const interaction: InteractionObject = GetUserProfilePreferencesPact.unauthorized;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TOKEN_KEY, jwtToken());
        userService.fetchUserPreferences().subscribe({
          error: (error: HttpErrorResponse) => {
            expect(error).toBeTruthy();
            expect(error.status).toBe(interaction.willRespondWith.status);
            expect(error.error).toStrictEqual(interaction.willRespondWith.body);
            done();
          },
        });
      });
    });

    it('not found', (done) => {
      const interaction: InteractionObject = GetUserProfilePreferencesPact.not_found;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TOKEN_KEY, jwtToken({ user: { id: 'notFoundId' }, authorities: ['profile:read'] }));
        userService.fetchUserPreferences().subscribe({
          error: (error: HttpErrorResponse) => {
            expect(error).toBeTruthy();
            expect(error.status).toBe(interaction.willRespondWith.status);
            expect(error.error).toStrictEqual(interaction.willRespondWith.body);
            done();
          },
        });
      });
    });
  });

  describe('Update User Profile Preferences', () => {
    beforeEach(() => {
      userService.setUserPreferences(
        new UserPreferences({
          _links: {
            [CurrentUserRelations.CURRENT_USER_REL]: { href: 'http://localhost/api/user/profile' },
            self: { href: 'http://localhost/api/user/profile/preferences' },
          },
          _templates: {
            ...defaultTemplate,
            ...updateProfilePreferencesTemplate,
          },
        }),
      );
    });

    it('successful', (done) => {
      const interaction: InteractionObject = UpdateUserProfilePreferencesPact.successful;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(
          TOKEN_KEY,
          jwtToken({
            user: { id: 'pactUserId' },
            authorities: ['profile:read', 'profile:update'],
          }),
        );
        userSettingsService.updateUserPreferences({ darkMode: true }).subscribe((response: User) => {
          expect(response).toBeTruthy();
          expect(response.id).toBe(interaction.willRespondWith.body.id);
          expect(response._links).toBeTruthy();
          expect(response._templates?.default).toBeTruthy();
          done();
        });
      });
    });

    it('unauthorized', (done) => {
      const interaction: InteractionObject = UpdateUserProfilePreferencesPact.unauthorized;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TOKEN_KEY, jwtToken());
        userSettingsService.updateUserPreferences({ darkMode: true }).subscribe({
          error: (error: HttpErrorResponse) => {
            expect(error).toBeTruthy();
            expect(error.status).toBe(interaction.willRespondWith.status);
            expect(error.error).toStrictEqual(interaction.willRespondWith.body);
            done();
          },
        });
      });
    });

    it('not found', (done) => {
      const interaction: InteractionObject = UpdateUserProfilePreferencesPact.not_found;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(
          TOKEN_KEY,
          jwtToken({
            user: { id: 'notFoundId' },
            authorities: ['profile:read', 'profile:update'],
          }),
        );
        userSettingsService.updateUserPreferences({ darkMode: true }).subscribe({
          error: (error: HttpErrorResponse) => {
            expect(error).toBeTruthy();
            expect(error.status).toBe(interaction.willRespondWith.status);
            expect(error.error).toStrictEqual(interaction.willRespondWith.body);
            done();
          },
        });
      });
    });
  });
});
