import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { SessionRepository, SessionService, stubMessageServiceProvider } from '@app/ui/shared/app';
import { UserSettingsService } from '@app/ui/shared/core';
import { CurrentUserRelations, ProfileAuthority, TokenKeys, User, UserPreferences } from '@app/ui/shared/domain';
import {
  changePasswordTemplate,
  defaultTemplate,
  deleteProfileTemplate,
  stubActionsProvider,
  updateProfilePreferencesTemplate,
  updateProfileTemplate,
  uploadAvatarTemplate,
} from '@app/ui/testing';
import { HalFormClientModule, HalFormService } from '@hal-form-client';
import { InteractionObject, Pact } from '@pact-foundation/pact';
import { avengersAssemble } from '../../interceptor/pact.interceptor';
import { pactForResource } from '../../utils/pact.utils';
import { jwtToken } from '../../utils/token.utils';
import {
  DeleteUserProfilePact,
  GetUserProfilePact,
  GetUserProfilePreferencesPact,
  UpdateUserProfilePact,
  UpdateUserProfilePasswordPact,
  UpdateUserProfilePreferencesPact,
  UploadAvatarProfilePact,
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
      providers: [avengersAssemble(provider.mockService.baseUrl), stubMessageServiceProvider, stubActionsProvider],
    });
    const halFormService = TestBed.inject(HalFormService);
    halFormService.setResource({
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
        localStorage.setItem(TokenKeys.TOKEN, jwtToken({ authorities: [ProfileAuthority.PROFILE_READ] }));
        sessionService['_fetchUser']().subscribe((user: User) => {
          expect(user).toBeTruthy();
          expect(user.id).toBe(interaction.willRespondWith.body.id);
          expect(user._links).toBeTruthy();
          expect(user._links?.self.href).toBe(interaction.willRespondWith.body._links.self.href);
          expect(user._links?.ws.href).toBe(interaction.willRespondWith.body._links.ws.href);
          expect(user._templates?.default).toBeTruthy();
          expect(user.userPreferences).toBeTruthy();
          expect(user.userPreferences?._templates).toBeTruthy();
          expect(user.userPreferences?._templates?.default).toBeTruthy();
          done();
        });
      });
    });

    it('with update', (done) => {
      const interaction: InteractionObject = GetUserProfilePact.with_update;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(
          TokenKeys.TOKEN,
          jwtToken({ authorities: [ProfileAuthority.PROFILE_READ, ProfileAuthority.PROFILE_UPDATE] }),
        );
        sessionService['_fetchUser']().subscribe((user: User) => {
          expect(user).toBeTruthy();
          expect(user.id).toBe(interaction.willRespondWith.body.id);
          expect(user._templates?.default).toBeTruthy();
          expect(user._templates?.[CurrentUserRelations.UPDATE_PROFILE_REL]).toBeTruthy();
          expect(user._templates?.[CurrentUserRelations.UPLOAD_AVATAR_REL]).toBeTruthy();
          expect(user._templates?.[CurrentUserRelations.CHANGE_PASSWORD_REL]).toBeTruthy();
          expect(user.userPreferences).toBeTruthy();
          expect(user.userPreferences?._templates).toBeTruthy();
          expect(user.userPreferences?._templates?.default).toBeTruthy();
          expect(user.userPreferences?._templates?.[CurrentUserRelations.UPDATE_PREFERENCES_REL]).toBeTruthy();
          done();
        });
      });
    });

    it('with delete', (done) => {
      const interaction: InteractionObject = GetUserProfilePact.with_delete;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(
          TokenKeys.TOKEN,
          jwtToken({ authorities: [ProfileAuthority.PROFILE_READ, ProfileAuthority.PROFILE_DELETE] }),
        );
        sessionService['_fetchUser']().subscribe((user: User) => {
          expect(user).toBeTruthy();
          expect(user.id).toBe(interaction.willRespondWith.body.id);
          expect(user._templates?.default).toBeTruthy();
          expect(user._templates?.[CurrentUserRelations.DELETE_ACCOUNT_REL]).toBeTruthy();
          done();
        });
      });
    });

    it('unauthorized', (done) => {
      const interaction: InteractionObject = GetUserProfilePact.unauthorized;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TokenKeys.TOKEN, jwtToken());
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
        localStorage.setItem(
          TokenKeys.TOKEN,
          jwtToken({
            user: { id: 'notFoundId' },
            authorities: [ProfileAuthority.PROFILE_READ],
          }),
        );
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
      sessionRepository.updateSession({
        user: new User({
          _links: { self: { href: 'http://localhost/api/user/profile' } },
          _templates: {
            ...defaultTemplate,
            ...updateProfileTemplate,
          },
        }),
      });
    });

    it('successful', (done) => {
      const interaction: InteractionObject = UpdateUserProfilePact.successful;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(
          TokenKeys.TOKEN,
          jwtToken({ authorities: [ProfileAuthority.PROFILE_READ, ProfileAuthority.PROFILE_UPDATE] }),
        );
        userSettingsService.updateProfile({ firstname: 'pactUserFirstname' }).subscribe((user: User) => {
          expect(user).toBeTruthy();
          expect(user.id).toBe(interaction.willRespondWith.body.id);
          expect(user._links).toBeTruthy();
          done();
        });
      });
    });

    it('unauthorized', (done) => {
      const interaction: InteractionObject = UpdateUserProfilePact.unauthorized;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TokenKeys.TOKEN, jwtToken());
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
          TokenKeys.TOKEN,
          jwtToken({
            user: { id: 'notFoundId' },
            authorities: [ProfileAuthority.PROFILE_READ, ProfileAuthority.PROFILE_UPDATE],
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
      sessionRepository.updateSession({
        user: new User({
          _links: { self: { href: 'http://localhost/api/user/profile' } },
          _templates: {
            ...defaultTemplate,
            ...changePasswordTemplate,
          },
        }),
      });
    });

    it('successful', (done) => {
      const interaction: InteractionObject = UpdateUserProfilePasswordPact.successful;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(
          TokenKeys.TOKEN,
          jwtToken({ authorities: [ProfileAuthority.PROFILE_READ, ProfileAuthority.PROFILE_UPDATE] }),
        );
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
        localStorage.setItem(TokenKeys.TOKEN, jwtToken());
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
          TokenKeys.TOKEN,
          jwtToken({
            user: { id: 'notFoundId' },
            authorities: [ProfileAuthority.PROFILE_READ, ProfileAuthority.PROFILE_UPDATE],
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
      sessionRepository.updateSession({
        user: new User({
          _links: { self: { href: 'http://localhost/api/user/profile' } },
          _templates: {
            ...defaultTemplate,
            ...deleteProfileTemplate,
          },
        }),
      });
    });

    it('successful', (done) => {
      provider.addInteraction(DeleteUserProfilePact.successful).then(() => {
        localStorage.setItem(
          TokenKeys.TOKEN,
          jwtToken({
            user: { id: 'pactUserId' },
            authorities: [ProfileAuthority.PROFILE_READ, ProfileAuthority.PROFILE_UPDATE],
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
        localStorage.setItem(TokenKeys.TOKEN, jwtToken());
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
          TokenKeys.TOKEN,
          jwtToken({
            user: { id: 'notFoundId' },
            authorities: [ProfileAuthority.PROFILE_READ, ProfileAuthority.PROFILE_UPDATE],
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
      sessionRepository.updateSession({
        user: new User({
          _links: {
            [CurrentUserRelations.USER_PREFERENCES_REL]: { href: 'http://localhost/api/user/profile/preferences' },
            self: { href: 'http://localhost/api/user/profile' },
          },
          _templates: { ...defaultTemplate },
        }),
      });
    });

    it('successful', (done) => {
      const interaction: InteractionObject = GetUserProfilePreferencesPact.successful;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(
          TokenKeys.TOKEN,
          jwtToken({
            user: { id: 'pactUserId' },
            authorities: [ProfileAuthority.PROFILE_READ],
          }),
        );
        sessionService['_fetchUserPreferences']().subscribe((userPreferences: User) => {
          expect(userPreferences).toBeTruthy();
          expect(userPreferences.id).toBe(interaction.willRespondWith.body.id);
          expect(userPreferences._links).toBeTruthy();
          expect(userPreferences._templates?.default).toBeTruthy();
          expect(userPreferences._links?.self.href).toBe(interaction.willRespondWith.body._links.self.href);
          expect(userPreferences._links?.ws.href).toBe(interaction.willRespondWith.body._links.ws.href);
          done();
        });
      });
    });

    it('unauthorized', (done) => {
      const interaction: InteractionObject = GetUserProfilePreferencesPact.unauthorized;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TokenKeys.TOKEN, jwtToken());
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
        localStorage.setItem(
          TokenKeys.TOKEN,
          jwtToken({
            user: { id: 'notFoundId' },
            authorities: [ProfileAuthority.PROFILE_READ],
          }),
        );
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
      sessionRepository.updateSession({
        userPreferences: new UserPreferences({
          _links: {
            [CurrentUserRelations.CURRENT_USER_REL]: { href: 'http://localhost/api/user/profile' },
            self: { href: 'http://localhost/api/user/profile/preferences' },
          },
          _templates: {
            ...defaultTemplate,
            ...updateProfilePreferencesTemplate,
          },
        }),
      });
    });

    it('successful', (done) => {
      const interaction: InteractionObject = UpdateUserProfilePreferencesPact.successful;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(
          TokenKeys.TOKEN,
          jwtToken({
            user: { id: 'pactUserId' },
            authorities: [ProfileAuthority.PROFILE_READ, ProfileAuthority.PROFILE_UPDATE],
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
        localStorage.setItem(TokenKeys.TOKEN, jwtToken());
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
          TokenKeys.TOKEN,
          jwtToken({
            user: { id: 'notFoundId' },
            authorities: [ProfileAuthority.PROFILE_READ, ProfileAuthority.PROFILE_UPDATE],
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

  // Consumer pact is OK but Spring generator fails creating the test
  describe.skip('Upload Profile Avatar', () => {
    beforeEach(() => {
      sessionRepository.updateSession({
        user: new User({
          _links: {
            self: { href: 'http://localhost/api/user/profile' },
            [CurrentUserRelations.UPLOAD_AVATAR_REL]: { href: 'http://localhost/api/user/profile/avatar' },
          },
          _templates: {
            ...defaultTemplate,
            ...uploadAvatarTemplate,
          },
        }),
      });
    });

    it('successful', (done) => {
      const interaction: InteractionObject = UploadAvatarProfilePact.successful;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(
          TokenKeys.TOKEN,
          jwtToken({ authorities: [ProfileAuthority.PROFILE_READ, ProfileAuthority.PROFILE_UPDATE] }),
        );
        const content = 'content';
        const data = new Blob([content], { type: 'text/plain' });
        const arrayOfBlob = new Array<Blob>();
        arrayOfBlob.push(data);
        const file: File = new File(arrayOfBlob, 'avatar.txt', { type: 'text/plain' });
        userSettingsService.uploadAvatar(file).subscribe((user: User) => {
          expect(user).toBeTruthy();
          expect(user.id).toBe(interaction.willRespondWith.body.id);
          expect(user._links).toBeTruthy();
          done();
        });
      });
    });
  });
});
