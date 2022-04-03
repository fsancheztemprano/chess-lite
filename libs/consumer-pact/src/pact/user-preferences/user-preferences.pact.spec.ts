import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { stubMessageServiceProvider, stubToasterServiceProvider } from '@app/ui/shared/app';
import { TOKEN_KEY, User, UserManagementRelations, UserPreferences } from '@app/ui/shared/domain';
import { defaultTemplate, updateUserPreferencesTemplate } from '@app/ui/testing';
import { HalFormClientModule } from '@hal-form-client';
import { InteractionObject, Pact } from '@pact-foundation/pact';
import { UserManagementDetailService } from '../../../../ui/feature/administration/src/lib/modules/user-management/modules/detail/services/user-management-detail.service';
import { stubUserManagementServiceProvider } from '../../../../ui/feature/administration/src/lib/modules/user-management/services/user-management.service.stub';
import { avengersAssemble } from '../../interceptor/pact.interceptor';
import { pactForResource } from '../../utils/pact.utils';
import { jwtToken } from '../../utils/token.util';
import { GetUserPreferencesPact, UpdateUserPreferencesPact } from './user-preferences.pact';

const provider: Pact = pactForResource('userPreferences');

describe('User Preferences Pact', () => {
  let service: UserManagementDetailService;

  beforeAll(() => provider.setup());
  afterEach(() => provider.verify());
  afterAll(() => provider.finalize());

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HalFormClientModule, RouterTestingModule],
      providers: [
        avengersAssemble(provider.mockService.baseUrl),
        stubMessageServiceProvider,
        stubToasterServiceProvider,
        stubUserManagementServiceProvider,
      ],
    });
    service = TestBed.inject(UserManagementDetailService);
  });

  describe('Get User Preferences', () => {
    beforeEach(() => {
      service.setUser(
        new User({
          _links: {
            [UserManagementRelations.USER_PREFERENCES_REL]: {
              href: 'http://localhost/api/user/preferences/pactUserPreferencesId',
            },
            self: {
              href: 'http://localhost/api/user/pactUserId',
            },
          },
        }),
      );
    });

    it('successful', (done) => {
      const interaction: InteractionObject = GetUserPreferencesPact.successful;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['user:preferences:read'] }));
        service.fetchUserPreferences().subscribe((response: UserPreferences) => {
          expect(response).toBeTruthy();
          expect(response.id).toBe(interaction.willRespondWith.body.id);
          expect(response.darkMode).toBe(interaction.willRespondWith.body.darkMode);
          expect(response.contentLanguage).toBe(interaction.willRespondWith.body.contentLanguage);
          expect(response._links).toBeTruthy();
          expect(response._templates?.default).toBeTruthy();
          done();
        });
      });
    });

    it('with update', (done) => {
      const interaction: InteractionObject = GetUserPreferencesPact.with_update;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(
          TOKEN_KEY,
          jwtToken({ authorities: ["user:preferences:read', 'user:preferences:update"] }),
        );
        service.fetchUserPreferences().subscribe((response: UserPreferences) => {
          expect(response).toBeTruthy();
          expect(response._templates?.default).toBeTruthy();
          expect(response._templates?.[UserManagementRelations.USER_UPDATE_REL]).toBeTruthy();
          done();
        });
      });
    });

    it('not found', (done) => {
      const interaction: InteractionObject = GetUserPreferencesPact.not_found;
      provider.addInteraction(interaction).then(() => {
        service.setUser(
          new User({
            _links: {
              [UserManagementRelations.USER_PREFERENCES_REL]: {
                href: 'http://localhost/api/user/preferences/notFoundId',
              },
              self: {
                href: 'http://localhost/api/user/pactUserId',
              },
            },
          }),
        );

        localStorage.setItem(
          TOKEN_KEY,
          jwtToken({ authorities: ["user:preferences:read', 'user:preferences:update"] }),
        );
        service.fetchUserPreferences().subscribe({
          error: (error: HttpErrorResponse) => {
            expect(error).toBeTruthy();
            expect(error.status).toBe(interaction.willRespondWith.status);
            expect(error.error).toStrictEqual(interaction.willRespondWith.body);
            done();
          },
        });
      });
    });

    it('unauthorized', (done) => {
      const interaction: InteractionObject = GetUserPreferencesPact.unauthorized;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TOKEN_KEY, jwtToken());
        service.fetchUserPreferences().subscribe({
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

  describe('Update User Preferences', () => {
    let pactUserPreferences: UserPreferences;

    beforeEach(() => {
      pactUserPreferences = new UserPreferences({
        _links: {
          user: {
            href: 'http://localhost/api/user/pactUserId',
          },
          self: {
            href: 'http://localhost/api/user/preferences/pactUserPreferencesId',
          },
        },
        _templates: {
          ...defaultTemplate,
          ...updateUserPreferencesTemplate,
        },
      });
    });

    it('successful', (done) => {
      const interaction: InteractionObject = UpdateUserPreferencesPact.successful;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['user:preferences:update'] }));
        service
          .updateUserPreferences(pactUserPreferences, { darkMode: true })
          .subscribe((response: UserPreferences) => {
            expect(response).toBeTruthy();
            expect(response.id).toBe(interaction.willRespondWith.body.id);
            expect(response.darkMode).toBe(interaction.willRespondWith.body.darkMode);
            expect(response.contentLanguage).toBe(interaction.willRespondWith.body.contentLanguage);
            expect(response._links).toBeTruthy();
            expect(response._templates?.default).toBeTruthy();
            done();
          });
      });
    });

    it('not found', (done) => {
      const interaction: InteractionObject = UpdateUserPreferencesPact.not_found;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['user:preferences:update'] }));
        const notFoundPreferences = new UserPreferences({
          _links: {
            user: {
              href: 'http://localhost/api/user/pactUserId',
            },
            self: {
              href: 'http://localhost/api/user/preferences/notFoundId',
            },
          },
          _templates: {
            ...defaultTemplate,
            ...updateUserPreferencesTemplate,
          },
        });

        service.updateUserPreferences(notFoundPreferences, { darkMode: true }).subscribe({
          error: (error: HttpErrorResponse) => {
            expect(error).toBeTruthy();
            expect(error.status).toBe(interaction.willRespondWith.status);
            expect(error.error).toStrictEqual(interaction.willRespondWith.body);
            done();
          },
        });
      });
    });

    it('unauthorized', (done) => {
      const interaction: InteractionObject = UpdateUserPreferencesPact.unauthorized;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TOKEN_KEY, jwtToken());
        service.updateUserPreferences(pactUserPreferences, { darkMode: true }).subscribe({
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
