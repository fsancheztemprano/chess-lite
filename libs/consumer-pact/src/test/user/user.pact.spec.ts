import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivationTokenRelations, TOKEN_KEY, User, UserManagementRelations, UserPage } from '@app/domain';
import {
  createUserTemplate,
  defaultTemplate,
  updateUserAuthoritiesTemplate,
  updateUserRoleTemplate,
  updateUserTemplate,
} from '@app/domain/mocks';
import { HalFormClientModule } from '@hal-form-client';
import { InteractionObject, Pact } from '@pact-foundation/pact';
import { stubMessageServiceProvider } from '../../../../../apps/app/src/app/core/services/message.service.stub';
import { stubToasterServiceProvider } from '../../../../../apps/app/src/app/core/services/toaster.service.stub';
import { UserManagementDetailService } from '../../../../../apps/app/src/app/modules/administration/modules/user-management/modules/detail/services/user-management-detail.service';
import { UserManagementService } from '../../../../../apps/app/src/app/modules/administration/modules/user-management/services/user-management.service';
import { AdministrationService } from '../../../../../apps/app/src/app/modules/administration/services/administration.service';
import { avengersAssemble } from '../../interceptor/pact.interceptor';
import { pactForResource } from '../../utils/pact.utils';
import { jwtToken } from '../../utils/token.util';
import {
  CreateUserPact,
  GetAllUsersPact,
  GetUserPact,
  UpdateUserAuthoritiesPact,
  UpdateUserPact,
  UpdateUserRolePact,
} from './user.pact';

const provider: Pact = pactForResource('user');

describe('User Pacts', () => {
  let userManagementService: UserManagementService;
  let userDetailService: UserManagementDetailService;

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
      ],
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
    userManagementService = new UserManagementService(TestBed.inject(HttpClient), administrationService);
  });

  describe('Get User', () => {
    it('successful', (done) => {
      const interaction: InteractionObject = GetUserPact.successful;
      localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['user:read'] }));
      provider.addInteraction(interaction).then(() => {
        userManagementService.fetchUser('pactUserId').subscribe((user: User) => {
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
        userManagementService.fetchUser('pactUserId').subscribe((user: User) => {
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
        userManagementService.fetchUser('pactUserId').subscribe((user: User) => {
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
        userManagementService.fetchUser('pactUserId').subscribe((user: User) => {
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
        userManagementService.fetchUser('pactUserId').subscribe((user: User) => {
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
        userManagementService.fetchUser('pactUserId').subscribe({
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
        userManagementService.fetchUser('notFoundId').subscribe({
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
        userManagementService.fetchUsers().subscribe((userPage: UserPage) => {
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
        userManagementService.fetchUsers().subscribe((userPage: UserPage) => {
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
        userManagementService.fetchUsers().subscribe({
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
        userManagementService
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
        userManagementService
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
        userManagementService
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

  describe('Update User', () => {
    beforeEach(() => {
      userDetailService = TestBed.inject(UserManagementDetailService);
      userDetailService.setUser(
        new User({
          _links: {
            self: { href: 'http://localhost/api/user/pactUserId' },
          },
          _templates: {
            ...defaultTemplate,
            ...updateUserTemplate,
          },
        }),
      );
    });

    it('successful', (done) => {
      const interaction: InteractionObject = UpdateUserPact.successful;
      localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['user:read', 'user:update'] }));
      provider.addInteraction(interaction).then(() => {
        userDetailService.updateUser({ firstname: 'pactUserFirstname' }).subscribe((user: User) => {
          expect(user).toBeTruthy();
          expect(user.id).toBe(interaction.willRespondWith.body.id);
          expect(user._links).toBeTruthy();
          expect(user._templates?.default).toBeTruthy();
          done();
        });
      });
    });

    it('not found', (done) => {
      const interaction: InteractionObject = UpdateUserPact.not_found;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['user:read', 'user:update'] }));
        userDetailService.setUser(
          new User({
            _links: {
              self: { href: 'http://localhost/api/user/notFoundId' },
            },
            _templates: {
              ...defaultTemplate,
              ...updateUserTemplate,
            },
          }),
        );

        userDetailService.updateUser({ firstname: 'notFoundFirstname' }).subscribe({
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
      const interaction: InteractionObject = UpdateUserPact.unauthorized;
      localStorage.setItem(TOKEN_KEY, jwtToken());
      provider.addInteraction(interaction).then(() => {
        userDetailService.updateUser({ firstname: 'pactUserFirstname' }).subscribe({
          error: (error: HttpErrorResponse) => {
            expect(error).toBeTruthy();
            expect(error.status).toBe(interaction.willRespondWith.status);
            expect(error.error).toStrictEqual(interaction.willRespondWith.body);
            done();
          },
        });
      });
    });

    it('existing', (done) => {
      const interaction: InteractionObject = UpdateUserPact.existing;
      localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['user:read', 'user:update'] }));
      provider.addInteraction(interaction).then(() => {
        userDetailService.updateUser({ email: 'existingUser@localhost' }).subscribe({
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

  describe('Update User Role', () => {
    beforeEach(() => {
      userDetailService = TestBed.inject(UserManagementDetailService);
      userDetailService.setUser(
        new User({
          _links: {
            self: { href: 'http://localhost/api/user/pactUserId' },
          },
          _templates: {
            ...defaultTemplate,
            ...updateUserRoleTemplate,
          },
        }),
      );
    });

    it('successful', (done) => {
      const interaction: InteractionObject = UpdateUserRolePact.successful;
      localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['user:read', 'user:update:role'] }));
      provider.addInteraction(interaction).then(() => {
        userDetailService.updateUserRole('pactRoleId').subscribe((user: User) => {
          expect(user).toBeTruthy();
          expect(user.id).toBe(interaction.willRespondWith.body.id);
          expect(user._links).toBeTruthy();
          expect(user._templates?.default).toBeTruthy();
          done();
        });
      });
    });

    it('user not found', (done) => {
      const interaction: InteractionObject = UpdateUserRolePact.user_not_found;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['user:read', 'user:update:role'] }));
        userDetailService.setUser(
          new User({
            _links: {
              self: { href: 'http://localhost/api/user/notFoundId' },
            },
            _templates: {
              ...defaultTemplate,
              [UserManagementRelations.USER_UPDATE_ROLE_REL]: {
                method: 'PATCH',
                properties: [{ name: 'roleId', type: 'text' }],
                target: 'http://localhost/api/user/notFoundId/role',
              },
            },
          }),
        );

        userDetailService.updateUserRole('pactRoleId').subscribe({
          error: (error: HttpErrorResponse) => {
            expect(error).toBeTruthy();
            expect(error.status).toBe(interaction.willRespondWith.status);
            expect(error.error).toStrictEqual(interaction.willRespondWith.body);
            done();
          },
        });
      });
    });

    it('role not found', (done) => {
      const interaction: InteractionObject = UpdateUserRolePact.role_not_found;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['user:read', 'user:update:role'] }));
        userDetailService.updateUserRole('notFoundId').subscribe({
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
      const interaction: InteractionObject = UpdateUserRolePact.unauthorized;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TOKEN_KEY, jwtToken());
        userDetailService.updateUserRole('pactRoleId').subscribe({
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

  describe('Update User Authorities', () => {
    beforeEach(() => {
      userDetailService = TestBed.inject(UserManagementDetailService);
      userDetailService.setUser(
        new User({
          _links: {
            self: { href: 'http://localhost/api/user/pactUserId' },
          },
          _templates: {
            ...defaultTemplate,
            ...updateUserAuthoritiesTemplate,
          },
        }),
      );
    });

    it('successful', (done) => {
      const interaction: InteractionObject = UpdateUserAuthoritiesPact.successful;
      localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['user:read', 'user:update:authorities'] }));
      provider.addInteraction(interaction).then(() => {
        userDetailService.updateUserAuthorities(['pactAuthorityId']).subscribe((user: User) => {
          expect(user).toBeTruthy();
          expect(user.id).toBe(interaction.willRespondWith.body.id);
          expect(user._links).toBeTruthy();
          expect(user._templates?.default).toBeTruthy();
          done();
        });
      });
    });

    it('user not found', (done) => {
      const interaction: InteractionObject = UpdateUserAuthoritiesPact.user_not_found;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['user:read', 'user:update:authorities'] }));
        userDetailService.setUser(
          new User({
            _links: {
              self: { href: 'http://localhost/api/user/notFoundId' },
            },
            _templates: {
              ...defaultTemplate,
              [UserManagementRelations.USER_UPDATE_AUTHORITIES_REL]: {
                method: 'PATCH',
                properties: [{ name: 'authorityIds' }],
                target: 'http://localhost/api/user/notFoundId/authorities',
              },
            },
          }),
        );

        userDetailService.updateUserAuthorities(['pactAuthorityId']).subscribe({
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
      const interaction: InteractionObject = UpdateUserAuthoritiesPact.unauthorized;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TOKEN_KEY, jwtToken());
        userDetailService.updateUserAuthorities(['pactAuthorityId']).subscribe({
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
