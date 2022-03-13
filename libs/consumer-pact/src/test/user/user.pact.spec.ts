import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivationTokenRelations, TOKEN_KEY, User, UserManagementRelations, UserPage } from '@app/domain';
import { createUserTemplate, defaultTemplate } from '@app/domain/mocks';
import { HalFormClientModule } from '@hal-form-client';
import { InteractionObject, Pact } from '@pact-foundation/pact';
import { UserManagementService } from '../../../../../apps/app/src/app/modules/administration/modules/user-management/services/user-management.service';
import { AdministrationService } from '../../../../../apps/app/src/app/modules/administration/services/administration.service';
import { avengersAssemble } from '../../interceptor/pact.interceptor';
import { pactForResource } from '../../utils/pact.utils';
import { jwtToken } from '../../utils/token.util';
import { CreateUserPact, GetAllUsersPact, GetUserPact } from './user.pact';

const provider: Pact = pactForResource('user');

describe('User Pacts', () => {
  let service: UserManagementService;

  beforeAll(() => provider.setup());
  afterEach(() => provider.verify());
  afterAll(() => provider.finalize());

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HalFormClientModule],
      providers: [avengersAssemble(provider.mockService.baseUrl)],
    });
    const administrationService: AdministrationService = TestBed.inject(AdministrationService);
    administrationService.setRootResource({
      _links: {
        self: {
          href: '/api/administration',
        },
      },
      _embedded: {
        [UserManagementRelations.USER_MANAGEMENT_REL]: {
          _links: {
            self: {
              href: '/api/administration',
            },
            [UserManagementRelations.USER_REL]: {
              href: '/api/user/{userId}',
              templated: true,
            },
            [UserManagementRelations.USERS_REL]: {
              href: '/api/user{?search,page,size,sort}',
              templated: true,
            },
          },
          _templates: {
            ...defaultTemplate,
            ...createUserTemplate,
          },
        },
      },
      _templates: {
        ...defaultTemplate,
      },
    });
    service = new UserManagementService(TestBed.inject(HttpClient), administrationService);
  });

  describe('Get User', () => {
    it('successful', (done) => {
      const interaction: InteractionObject = GetUserPact.successful;
      localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['user:read'] }));
      provider.addInteraction(interaction).then(() => {
        service.fetchUser('pactUserId').subscribe((user: User) => {
          expect(user).toBeTruthy();
          expect(user.id).toBe(interaction.willRespondWith.body.id);
          expect(user._links).toBeTruthy();
          expect(user._templates?.default).toBeTruthy();
          done();
        });
      });
    });

    it('with update', (done) => {
      const interaction: InteractionObject = GetUserPact.with_update;
      localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['user:read', 'user:update'] }));
      provider.addInteraction(interaction).then(() => {
        service.fetchUser('pactUserId').subscribe((user: User) => {
          expect(user).toBeTruthy();
          expect(user._templates?.[ActivationTokenRelations.REQUEST_ACTIVATION_TOKEN_REL]).toBeTruthy();
          expect(user._templates?.[UserManagementRelations.USER_UPDATE_REL]).toBeTruthy();
          done();
        });
      });
    });

    it('with delete', (done) => {
      const interaction: InteractionObject = GetUserPact.with_delete;
      localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['user:read', 'user:delete'] }));
      provider.addInteraction(interaction).then(() => {
        service.fetchUser('pactUserId').subscribe((user: User) => {
          expect(user).toBeTruthy();
          expect(user._templates?.[UserManagementRelations.USER_DELETE_REL]).toBeTruthy();
          done();
        });
      });
    });

    it('with update role', (done) => {
      const interaction: InteractionObject = GetUserPact.with_update_role;
      localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['user:read', 'user:update:role'] }));
      provider.addInteraction(interaction).then(() => {
        service.fetchUser('pactUserId').subscribe((user: User) => {
          expect(user).toBeTruthy();
          expect(user._templates?.[UserManagementRelations.USER_UPDATE_ROLE_REL]).toBeTruthy();
          done();
        });
      });
    });

    it('with update authorities', (done) => {
      const interaction: InteractionObject = GetUserPact.with_update_authorities;
      localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['user:read', 'user:update:authorities'] }));
      provider.addInteraction(interaction).then(() => {
        service.fetchUser('pactUserId').subscribe((user: User) => {
          expect(user).toBeTruthy();
          expect(user._templates?.[UserManagementRelations.USER_UPDATE_AUTHORITIES_REL]).toBeTruthy();
          done();
        });
      });
    });

    it('unauthorized', (done) => {
      const interaction: InteractionObject = GetUserPact.unauthorized;
      localStorage.setItem(TOKEN_KEY, jwtToken());
      provider.addInteraction(interaction).then(() => {
        service.fetchUser('pactUserId').subscribe({
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
      const interaction: InteractionObject = GetUserPact.not_found;
      localStorage.setItem(TOKEN_KEY, jwtToken());
      provider.addInteraction(interaction).then(() => {
        service.fetchUser('notFoundId').subscribe({
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

  describe('Get All Users', () => {
    it('successful', (done) => {
      const interaction: InteractionObject = GetAllUsersPact.successful;
      localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['user:read'] }));
      provider.addInteraction(interaction).then(() => {
        service.fetchUsers().subscribe((userPage: UserPage) => {
          expect(userPage).toBeTruthy();
          expect(userPage._embedded).toBeTruthy();
          expect(userPage._embedded.userModels).toHaveLength(3);
          expect(userPage._links).toBeTruthy();
          expect(userPage._templates?.default).toBeTruthy();
          done();
        });
      });
    });

    it('with create', (done) => {
      const interaction: InteractionObject = GetAllUsersPact.with_create;
      localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['user:read', 'user:create'] }));
      provider.addInteraction(interaction).then(() => {
        service.fetchUsers().subscribe((userPage: UserPage) => {
          expect(userPage).toBeTruthy();
          expect(userPage._embedded).toBeTruthy();
          expect(userPage._embedded.userModels).toHaveLength(3);
          expect(userPage._links).toBeTruthy();
          expect(userPage._templates?.default).toBeTruthy();
          expect(userPage._templates?.[UserManagementRelations.USER_CREATE_REL]).toBeTruthy();
          done();
        });
      });
    });

    it('unauthorized', (done) => {
      const interaction: InteractionObject = GetAllUsersPact.unauthorized;
      localStorage.setItem(TOKEN_KEY, jwtToken());
      provider.addInteraction(interaction).then(() => {
        service.fetchUsers().subscribe({
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

  describe('Create User', () => {
    it('successful', (done) => {
      const interaction: InteractionObject = CreateUserPact.successful;
      localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['user:create'] }));
      provider.addInteraction(interaction).then(() => {
        service
          .createUser({
            username: 'createdUser',
            password: 'createdUser',
            email: 'createdUser@localhost',
          })
          .subscribe((user: User) => {
            expect(user).toBeTruthy();
            expect(user.id).toBe(interaction.willRespondWith.body.id.getValue());
            expect(user._links).toBeTruthy();
            expect(user._templates?.default).toBeTruthy();
            done();
          });
      });
    });

    it('existing', (done) => {
      const interaction: InteractionObject = CreateUserPact.existing;
      localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['user:create'] }));
      provider.addInteraction(interaction).then(() => {
        service
          .createUser({
            username: 'pactUser',
            password: 'pactUser',
            email: 'pactUser@localhost',
          })
          .subscribe({
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
      const interaction: InteractionObject = CreateUserPact.unauthorized;
      localStorage.setItem(TOKEN_KEY, jwtToken());
      provider.addInteraction(interaction).then(() => {
        service
          .createUser({
            username: 'createdUser',
            password: 'createdUser',
            email: 'createdUser@localhost',
          })
          .subscribe({
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
