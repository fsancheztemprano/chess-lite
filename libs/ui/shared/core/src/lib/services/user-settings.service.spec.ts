import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SessionRepository, stubSessionServiceProvider } from '@app/ui/shared/app';
import {
  CurrentUserRelations,
  IUserPreferences,
  User,
  UserChangePasswordInput,
  UserUpdateProfileInput,
} from '@app/ui/shared/domain';
import {
  changePasswordTemplate,
  defaultTemplate,
  deleteProfileTemplate,
  updateProfilePreferencesTemplate,
  updateProfileTemplate,
  uploadAvatarTemplate,
} from '@app/ui/testing';
import { HalFormClientModule, Resource } from '@hal-form-client';
import { Actions, EffectsNgModule } from '@ngneat/effects-ng';
import { randomUUID } from 'crypto';
import { firstValueFrom } from 'rxjs';
import { UserSettingsService } from './user-settings.service';

describe('UserSettingsService', () => {
  let service: UserSettingsService;
  let customActionsStream: Actions;
  let sessionRepository: SessionRepository;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    customActionsStream = new Actions();
    TestBed.configureTestingModule({
      imports: [HalFormClientModule, HttpClientTestingModule, EffectsNgModule.forRoot([], { customActionsStream })],
      providers: [stubSessionServiceProvider],
    });
    service = TestBed.inject(UserSettingsService);
    sessionRepository = TestBed.inject(SessionRepository);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCurrentUser', () => {
    it('should get current user', async () => {
      await expect(firstValueFrom(service.getCurrentUser())).resolves.toBeUndefined();

      const user = { id: '1' } as never;

      sessionRepository.updateSession({ user });

      await expect(firstValueFrom(service.getCurrentUser())).resolves.toEqual(user);
    });
  });

  describe('getCurrentUserPreferences', () => {
    it('should get current user preferences', async () => {
      const userPreferences = { contentLanguage: 'en' } as never;

      sessionRepository.updateSession({ userPreferences });

      await expect(firstValueFrom(service.getCurrentUserPreferences())).resolves.toEqual(userPreferences);
    });

    it('should return true if user has link to user preferences', async () => {
      sessionRepository.updateSession({
        user: new User({
          id: '1',
          _links: {
            self: { href: '/users/1' },
            [CurrentUserRelations.USER_PREFERENCES_REL]: { href: 'http://localhost/userPreferences' },
          },
        }),
      });

      await expect(firstValueFrom(service.hasLinkToUserPreferences())).resolves.toBeTrue();
    });

    it('should return false if user has no link to user preferences', async () => {
      sessionRepository.updateSession({
        user: new User({
          id: '1',
          _links: {
            self: { href: '/users/1' },
          },
        }),
      });

      await expect(firstValueFrom(service.hasLinkToUserPreferences())).resolves.toBeFalse();
    });

    it('should return false if no user to link to user preferences', async () => {
      sessionRepository.updateSession({ user: undefined });

      await expect(firstValueFrom(service.hasLinkToUserPreferences())).resolves.toBeFalse();
    });
  });

  describe('user profile', () => {
    it('should return false if has no user to update profile', async () => {
      sessionRepository.updateSession({ user: undefined });
      return expect(firstValueFrom(service.hasTemplateToUpdateProfile())).resolves.toBeFalse();
    });

    describe('can update profile', () => {
      beforeEach(() => {
        sessionRepository.updateSession({
          user: new User({
            id: '1',
            _links: { self: { href: '/api/users/1' } },
            _templates: { ...defaultTemplate, ...updateProfileTemplate },
          }),
        });
      });

      it('should return true if has template to update profile', async () => {
        return expect(firstValueFrom(service.hasTemplateToUpdateProfile())).resolves.toBeTrue();
      });

      it('should update user profile', (done) => {
        jest.spyOn<any, any>(service['actions'], 'dispatch');
        const profileInput: UserUpdateProfileInput = {
          firstname: 'firstname',
          lastname: 'lastname',
          profileImageUrl: 'profileImageUrl',
        };

        const updatedUser = {
          id: randomUUID(),
        };

        service.updateProfile(profileInput).subscribe((response) => {
          expect(response).toEqual(updatedUser);
          expect(service['actions'].dispatch).toHaveBeenCalledWith(
            expect.objectContaining({
              type: '[Session] Update Session',
              user: updatedUser,
            }),
          );
          done();
        });

        const req = httpTestingController.expectOne(`/api/users/1`);
        expect(req.request.method).toBe('PATCH');
        expect(req.request.body).toEqual(profileInput);
        req.flush(updatedUser);
      });
    });

    describe('cant update profile', () => {
      beforeEach(() => {
        sessionRepository.updateSession({
          user: new User({
            id: '1',
            _templates: { ...defaultTemplate },
          }),
        });
      });

      it('should return false if has no template to update profile', async () => {
        return expect(firstValueFrom(service.hasTemplateToUpdateProfile())).resolves.toBeFalse();
      });

      it('should not update user profile', (done) => {
        const profileInput: UserUpdateProfileInput = {
          firstname: 'firstname',
          lastname: 'lastname',
          profileImageUrl: 'profileImageUrl',
        };

        service.updateProfile(profileInput).subscribe(() => {
          done.fail('should not update user profile');
        });

        httpTestingController.expectNone(`/api/users/1`);
        done();
      });
    });
  });

  describe('delete account', () => {
    it('should return false if has no user to delete profile', async () => {
      sessionRepository.updateSession({ user: undefined });
      return expect(firstValueFrom(service.hasTemplateToDeleteAccount())).resolves.toBeFalse();
    });

    describe('can delete account', () => {
      beforeEach(() => {
        sessionRepository.updateSession({
          user: new User({
            id: '1',
            _links: { self: { href: '/api/users/1' } },
            _templates: { ...defaultTemplate, ...deleteProfileTemplate },
          }),
        });
      });

      it('should return true if has template to delete profile', async () => {
        return expect(firstValueFrom(service.hasTemplateToDeleteAccount())).resolves.toBeTrue();
      });

      it('should delete user account', (done) => {
        jest.spyOn<any, any>(service['actions'], 'dispatch');
        service.deleteAccount().subscribe(() => {
          expect(service['actions'].dispatch).toHaveBeenCalledWith({
            type: '[Session] Clear Session',
          });
          done();
        });

        const req = httpTestingController.expectOne(`/api/users/1`);
        expect(req.request.method).toBe('DELETE');
        req.flush({});
      });
    });

    describe('cant delete account', () => {
      beforeEach(() => {
        sessionRepository.updateSession({
          user: new User({
            id: '1',
            _templates: { ...defaultTemplate },
          }),
        });
      });

      it('should return false if has no template to delete profile', async () => {
        return expect(firstValueFrom(service.hasTemplateToDeleteAccount())).resolves.toBeFalse();
      });

      it('should not delete user account', (done) => {
        service.deleteAccount().subscribe(() => {
          done.fail('should not delete user account');
        });

        httpTestingController.expectNone(`/api/users/1`);
        done();
      });
    });
  });

  describe('change password', () => {
    it('should return false if has no user to change password', async () => {
      sessionRepository.updateSession({ user: undefined });
      return expect(firstValueFrom(service.hasTemplateToChangePassword())).resolves.toBeFalse();
    });

    describe('can change password', () => {
      beforeEach(() => {
        sessionRepository.updateSession({
          user: new User({
            id: '1',
            _links: { self: { href: '/api/users/1' } },
            _templates: { ...defaultTemplate, ...changePasswordTemplate },
          }),
        });
      });

      it('should return true if has template to change password', async () => {
        return expect(firstValueFrom(service.hasTemplateToChangePassword())).resolves.toBeTrue();
      });

      it('should change user password', (done) => {
        const passwordInput: UserChangePasswordInput = {
          password: 'password',
          newPassword: 'newPassword',
        };

        const updatedUser = {
          id: randomUUID(),
        };

        service.changePassword(passwordInput).subscribe(() => {
          done();
        });

        const req = httpTestingController.expectOne(
          changePasswordTemplate[CurrentUserRelations.CHANGE_PASSWORD_REL].target,
        );
        expect(req.request.method).toBe('PATCH');
        expect(req.request.body).toEqual(passwordInput);
        req.flush(updatedUser);
      });
    });

    describe('cant change password', () => {
      beforeEach(() => {
        sessionRepository.updateSession({
          user: new User({
            id: '1',
            _templates: { ...defaultTemplate },
          }),
        });
      });

      it('should return false if has no template to change password', async () => {
        return expect(firstValueFrom(service.hasTemplateToChangePassword())).resolves.toBeFalse();
      });

      it('should not change user password', (done) => {
        const passwordInput: UserChangePasswordInput = {
          password: 'password',
          newPassword: 'newPassword',
        };

        service.changePassword(passwordInput).subscribe(() => {
          done.fail('should not change user password');
        });

        httpTestingController.expectNone(changePasswordTemplate[CurrentUserRelations.CHANGE_PASSWORD_REL].target);
        done();
      });
    });
  });

  describe('upload avatar', () => {
    it('should return false if has no user to upload avatar', async () => {
      sessionRepository.updateSession({ user: undefined });
      return expect(firstValueFrom(service.hasTemplateToUploadAvatar())).resolves.toBeFalse();
    });

    describe('can upload avatar', () => {
      beforeEach(() => {
        sessionRepository.updateSession({
          user: new User({
            id: '1',
            _links: { self: { href: '/api/users/1' } },
            _templates: { ...defaultTemplate, ...uploadAvatarTemplate },
          }),
        });
      });

      it('should return true if has template to upload avatar', async () => {
        return expect(firstValueFrom(service.hasTemplateToUploadAvatar())).resolves.toBeTrue();
      });

      it('should upload user avatar', (done) => {
        jest.spyOn<any, any>(service['actions'], 'dispatch');
        const avatarInput: File = new File([], 'avatar.png');

        const updatedUser = {
          id: randomUUID(),
        };

        service.uploadAvatar(avatarInput).subscribe(() => {
          expect(service['actions'].dispatch).toHaveBeenCalledWith(
            expect.objectContaining({
              type: '[Session] Update Session',
              user: updatedUser,
            }),
          );
          done();
        });

        const req = httpTestingController.expectOne(
          uploadAvatarTemplate[CurrentUserRelations.UPLOAD_AVATAR_REL].target,
        );
        expect(req.request.method).toBe('PATCH');
        expect(req.request.body).toBeTruthy();
        req.flush(updatedUser);
      });
    });

    describe('cant upload avatar', () => {
      beforeEach(() => {
        sessionRepository.updateSession({
          user: new User({
            id: '1',
            _templates: { ...defaultTemplate },
          }),
        });
      });

      it('should return false if has no template to upload avatar', async () => {
        return expect(firstValueFrom(service.hasTemplateToUploadAvatar())).resolves.toBeFalse();
      });

      it('should not upload user avatar', (done) => {
        const avatarInput: File = new File([], 'avatar.png');

        service.uploadAvatar(avatarInput).subscribe(() => {
          done.fail('should not upload user avatar');
        });

        httpTestingController.expectNone(uploadAvatarTemplate[CurrentUserRelations.UPLOAD_AVATAR_REL].target);
        done();
      });
    });
  });

  describe('update user preferences', () => {
    it('should return false if no user preferences available', async () => {
      sessionRepository.updateSession({ userPreferences: undefined });
      return expect(firstValueFrom(service.hasTemplateToUpdateUserPreferences())).resolves.toBeFalse();
    });

    describe('can update user preferences', () => {
      beforeEach(() => {
        sessionRepository.updateSession({
          userPreferences: new Resource({
            id: '1',
            _links: { self: { href: '/api/users/1/preferences' } },
            _templates: { ...defaultTemplate, ...updateProfilePreferencesTemplate },
          }),
        });
      });

      it('should return true if has template to update user preferences', async () => {
        return expect(firstValueFrom(service.hasTemplateToUpdateUserPreferences())).resolves.toBeTrue();
      });

      it('should update user preferences', (done) => {
        jest.spyOn<any, any>(service['actions'], 'dispatch');
        const preferencesInput: IUserPreferences = {
          contentLanguage: 'en',
          darkMode: true,
        };

        const updatedUserPreferences = {
          id: randomUUID(),
          ...preferencesInput,
        };

        service.updateUserPreferences(preferencesInput).subscribe(() => {
          expect(service['actions'].dispatch).toHaveBeenCalledWith(
            expect.objectContaining({
              type: '[Session] Update Session',
              userPreferences: updatedUserPreferences,
            }),
          );
          done();
        });

        const req = httpTestingController.expectOne('/api/users/1/preferences');
        expect(req.request.method).toBe('PATCH');
        expect(req.request.body).toEqual(preferencesInput);
        req.flush(updatedUserPreferences);
      });
    });

    describe('cant update user preferences', () => {
      beforeEach(() => {
        sessionRepository.updateSession({
          userPreferences: new Resource({
            id: '1',
            _templates: { ...defaultTemplate },
          }),
        });
      });

      it('should return false if has no template to update user preferences', async () => {
        return expect(firstValueFrom(service.hasTemplateToUpdateUserPreferences())).resolves.toBeFalse();
      });

      it('should not update user preferences', (done) => {
        const preferencesInput: IUserPreferences = {
          contentLanguage: 'en',
          darkMode: true,
        };

        service.updateUserPreferences(preferencesInput).subscribe(() => {
          done.fail('should not update user preferences');
        });

        httpTestingController.expectNone('/api/users/1/preferences');
        done();
      });
    });
  });
});
