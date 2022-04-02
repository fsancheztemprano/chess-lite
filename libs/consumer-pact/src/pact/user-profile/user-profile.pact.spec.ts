import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { SessionService, stubMessageServiceProvider } from '@app/ui/shared/app';
import { CurrentUserRelations, TOKEN_KEY, User, UserPreferences } from '@app/ui/shared/domain';
import { SessionRepository } from '@app/ui/shared/store';
import {
  changePasswordTemplate,
  defaultTemplate,
  deleteProfileTemplate,
  updateProfilePreferencesTemplate,
  updateProfileTemplate,
} from '@app/ui/testing';
import { HalFormClientModule, HalFormService } from '@hal-form-client';
import { InteractionObject, Pact } from '@pact-foundation/pact';
import { UserSettingsService } from '../../../../ui/feature/user/src/lib/services/user-settings.service';
import { avengersAssemble } from '../../interceptor/pact.interceptor';
import { pactForResource } from '../../utils/pact.utils';
import { jwtToken } from '../../utils/token.util';
import {
  DeleteUserProfilePact,
  GetUserProfilePact,
  GetUserProfilePreferencesPact,
  UpdateUserProfilePact,
  UpdateUserProfilePasswordPact,
  UpdateUserProfilePreferencesPact,
} from './user-profile.pact';

const provider: Pact = pactForResource('userProfile');

describe('User Profile Pact', () => {
  let sessionService: SessionService;
  let sessionRepository: SessionRepository;
  let userSettingsService: UserSettingsService;

  beforeAll(() => provider.setup());
  afterEach(() => provider.verify());
  afterAll(() => provider.finalize());

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HalFormClientModule],
      providers: [avengersAssemble(provider.mockService.baseUrl), stubMessageServiceProvider],
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

    sessionRepository = TestBed.inject(SessionRepository);
    sessionService = TestBed.inject(SessionService);
    userSettingsService = TestBed.inject(UserSettingsService);
  });

  describe('Get User Profile', () => {
    it('successful', (done) => {
      const interaction: InteractionObject = GetUserProfilePact.successful;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['profile:read'] }));
        sessionService['_fetchUser']().subscribe((response: User) => {
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
        sessionService['_fetchUser']().subscribe((response: User) => {
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
        sessionService['_fetchUser']().subscribe((response: User) => {
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
        sessionService['_fetchUser']().subscribe({
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
        sessionService['_fetchUser']().subscribe({
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
      sessionRepository.updateUser(
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

  describe('Update User Profile Password', () => {
    beforeEach(() => {
      sessionRepository.updateUser(
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
      const interaction: InteractionObject = UpdateUserProfilePasswordPact.successful;
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
      const interaction: InteractionObject = UpdateUserProfilePasswordPact.unauthorized;
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
      const interaction: InteractionObject = UpdateUserProfilePasswordPact.not_found;
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
      sessionRepository.updateUser(
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
      sessionRepository.updateUser(
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
        sessionService['_fetchUserPreferences']().subscribe((response: User) => {
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
        sessionService['_fetchUserPreferences']().subscribe({
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
        sessionService['_fetchUserPreferences']().subscribe({
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
      sessionRepository.updateUserPreferences(
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
