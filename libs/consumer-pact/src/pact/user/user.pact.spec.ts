import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { stubMessageServiceProvider, stubToasterServiceProvider } from '@app/ui/shared/app';
import {
  ActivationTokenRelations,
  TokenKeys,
  User,
  UserAuthority,
  UserManagementRelations,
  UserPage,
} from '@app/ui/shared/domain';
import { AdministrationService } from '@app/ui/shared/feature/administration';
import {
  createUserTemplate,
  defaultTemplate,
  deleteUserTemplate,
  requestActivationTokenTemplate,
  updateUserAuthoritiesTemplate,
  updateUserRoleTemplate,
  updateUserTemplate,
} from '@app/ui/testing';
import { HalFormClientModule } from '@hal-form-client';
import { InteractionObject, Pact } from '@pact-foundation/pact';
import { UserManagementDetailService } from '../../../../ui/feature/administration/src/lib/modules/user-management/modules/detail/services/user-management-detail.service';
import { UserManagementService } from '../../../../ui/feature/administration/src/lib/modules/user-management/services/user-management.service';
import { avengersAssemble } from '../../interceptor/pact.interceptor';
import { JsonObject, pactForResource } from '../../utils/pact.utils';
import { jwtToken } from '../../utils/token.utils';
import {
  CreateUserPact,
  DeleteUserPact,
  GetAllUsersPact,
  GetUserPact,
  RequestActivationTokenPact,
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
    administrationService.setResource({
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
    userManagementService = new UserManagementService(administrationService);
  });

  describe('Get User', () => {
    it('successful', (done) => {
      const interaction: InteractionObject = GetUserPact.successful;
      localStorage.setItem(TokenKeys.TOKEN, jwtToken({ authorities: [UserAuthority.USER_READ] }));
      provider.addInteraction(interaction).then(() => {
        userManagementService.fetchUser('pactUserId').subscribe((user: User) => {
          expect(user).toBeTruthy();
          expect(user.id).toBe((<JsonObject>interaction.willRespondWith.body).id);
          expect(user._links).toBeTruthy();
          expect(user._links?.self?.href).toBe((<JsonObject>interaction.willRespondWith.body)._links.self.href);
          expect(user._links?.ws?.href).toBe((<JsonObject>interaction.willRespondWith.body)._links.ws.href);
          expect(user._templates?.default).toBeTruthy();
          done();
        });
      });
    });

    it('with update', (done) => {
      const interaction: InteractionObject = GetUserPact.with_update;
      localStorage.setItem(
        TokenKeys.TOKEN,
        jwtToken({ authorities: [UserAuthority.USER_READ, UserAuthority.USER_UPDATE] }),
      );
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
      localStorage.setItem(
        TokenKeys.TOKEN,
        jwtToken({ authorities: [UserAuthority.USER_READ, UserAuthority.USER_DELETE] }),
      );
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
      localStorage.setItem(
        TokenKeys.TOKEN,
        jwtToken({ authorities: [UserAuthority.USER_READ, UserAuthority.USER_UPDATE_ROLE] }),
      );
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
      localStorage.setItem(
        TokenKeys.TOKEN,
        jwtToken({ authorities: [UserAuthority.USER_READ, UserAuthority.USER_UPDATE_AUTHORITIES] }),
      );
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
      localStorage.setItem(TokenKeys.TOKEN, jwtToken());
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
      localStorage.setItem(TokenKeys.TOKEN, jwtToken());
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
      localStorage.setItem(TokenKeys.TOKEN, jwtToken({ authorities: [UserAuthority.USER_READ] }));
      provider.addInteraction(interaction).then(() => {
        userManagementService.fetchUsers().subscribe((userPage: UserPage) => {
          expect(userPage).toBeTruthy();
          expect(userPage._embedded).toBeTruthy();
          expect(userPage._embedded.userModels).toHaveLength(3);
          expect(userPage._links).toBeTruthy();
          expect(userPage._links?.self?.href).toBe((<JsonObject>interaction.willRespondWith.body)._links.self.href);
          expect(userPage._links?.ws?.href).toBe((<JsonObject>interaction.willRespondWith.body)._links.ws.href);
          expect(userPage._templates?.default).toBeTruthy();
          done();
        });
      });
    });

    it('with create', (done) => {
      const interaction: InteractionObject = GetAllUsersPact.with_create;
      localStorage.setItem(
        TokenKeys.TOKEN,
        jwtToken({ authorities: [UserAuthority.USER_READ, UserAuthority.USER_CREATE] }),
      );
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
      localStorage.setItem(TokenKeys.TOKEN, jwtToken());
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
      localStorage.setItem(TokenKeys.TOKEN, jwtToken({ authorities: [UserAuthority.USER_CREATE] }));
      provider.addInteraction(interaction).then(() => {
        userManagementService
          .createUser({
            username: 'createdUser',
            password: 'createdUser',
            email: 'createdUser@localhost',
          })
          .subscribe((user: User) => {
            expect(user).toBeTruthy();
            expect(user.id).toBe((<JsonObject>interaction.willRespondWith.body).id.getValue());
            expect(user._links).toBeTruthy();
            expect(user._templates?.default).toBeTruthy();
            done();
          });
      });
    });

    it('existing', (done) => {
      const interaction: InteractionObject = CreateUserPact.existing;
      localStorage.setItem(TokenKeys.TOKEN, jwtToken({ authorities: [UserAuthority.USER_CREATE] }));
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
      localStorage.setItem(TokenKeys.TOKEN, jwtToken());
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
      localStorage.setItem(
        TokenKeys.TOKEN,
        jwtToken({ authorities: [UserAuthority.USER_READ, UserAuthority.USER_UPDATE] }),
      );
      provider.addInteraction(interaction).then(() => {
        userDetailService.updateUser({ firstname: 'pactUserFirstname' }).subscribe((user: User) => {
          expect(user).toBeTruthy();
          expect(user.id).toBe((<JsonObject>interaction.willRespondWith.body).id);
          expect(user._links).toBeTruthy();
          expect(user._templates?.default).toBeTruthy();
          done();
        });
      });
    });

    it('not found', (done) => {
      const interaction: InteractionObject = UpdateUserPact.not_found;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(
          TokenKeys.TOKEN,
          jwtToken({ authorities: [UserAuthority.USER_READ, UserAuthority.USER_UPDATE] }),
        );
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
      localStorage.setItem(TokenKeys.TOKEN, jwtToken());
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
      localStorage.setItem(
        TokenKeys.TOKEN,
        jwtToken({ authorities: [UserAuthority.USER_READ, UserAuthority.USER_UPDATE] }),
      );
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
      localStorage.setItem(
        TokenKeys.TOKEN,
        jwtToken({ authorities: [UserAuthority.USER_READ, UserAuthority.USER_UPDATE_ROLE] }),
      );
      provider.addInteraction(interaction).then(() => {
        userDetailService.updateUserRole('pactRoleId').subscribe((user: User) => {
          expect(user).toBeTruthy();
          expect(user.id).toBe((<JsonObject>interaction.willRespondWith.body).id);
          expect(user._links).toBeTruthy();
          expect(user._templates?.default).toBeTruthy();
          done();
        });
      });
    });

    it('user not found', (done) => {
      const interaction: InteractionObject = UpdateUserRolePact.user_not_found;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(
          TokenKeys.TOKEN,
          jwtToken({ authorities: [UserAuthority.USER_READ, UserAuthority.USER_UPDATE_ROLE] }),
        );
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
        localStorage.setItem(
          TokenKeys.TOKEN,
          jwtToken({ authorities: [UserAuthority.USER_READ, UserAuthority.USER_UPDATE_ROLE] }),
        );
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
        localStorage.setItem(TokenKeys.TOKEN, jwtToken());
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
      localStorage.setItem(
        TokenKeys.TOKEN,
        jwtToken({ authorities: [UserAuthority.USER_READ, UserAuthority.USER_UPDATE_AUTHORITIES] }),
      );
      provider.addInteraction(interaction).then(() => {
        userDetailService.updateUserAuthorities(['pactAuthorityId']).subscribe((user: User) => {
          expect(user).toBeTruthy();
          expect(user.id).toBe((<JsonObject>interaction.willRespondWith.body).id);
          expect(user._links).toBeTruthy();
          expect(user._templates?.default).toBeTruthy();
          done();
        });
      });
    });

    it('user not found', (done) => {
      const interaction: InteractionObject = UpdateUserAuthoritiesPact.user_not_found;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(
          TokenKeys.TOKEN,
          jwtToken({ authorities: [UserAuthority.USER_READ, UserAuthority.USER_UPDATE_AUTHORITIES] }),
        );
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
        localStorage.setItem(TokenKeys.TOKEN, jwtToken());
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

  describe('Delete User', () => {
    beforeEach(() => {
      userDetailService = TestBed.inject(UserManagementDetailService);
      userDetailService.setUser(
        new User({
          _links: {
            self: { href: 'http://localhost/api/user/pactUserId' },
          },
          _templates: {
            ...defaultTemplate,
            ...deleteUserTemplate,
          },
        }),
      );
    });

    it('successful', (done) => {
      const interaction: InteractionObject = DeleteUserPact.successful;
      localStorage.setItem(
        TokenKeys.TOKEN,
        jwtToken({ authorities: [UserAuthority.USER_READ, UserAuthority.USER_DELETE] }),
      );
      provider.addInteraction(interaction).then(() => {
        userDetailService.deleteUser().subscribe((response) => {
          expect(response).toBeTruthy();
          done();
        });
      });
    });

    it('user not found', (done) => {
      const interaction: InteractionObject = DeleteUserPact.not_found;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(
          TokenKeys.TOKEN,
          jwtToken({ authorities: [UserAuthority.USER_READ, UserAuthority.USER_DELETE] }),
        );
        userDetailService.setUser(
          new User({
            _links: {
              self: { href: 'http://localhost/api/user/notFoundId' },
            },
            _templates: {
              ...defaultTemplate,
              ...deleteUserTemplate,
            },
          }),
        );

        userDetailService.deleteUser().subscribe({
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
      const interaction: InteractionObject = DeleteUserPact.unauthorized;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TokenKeys.TOKEN, jwtToken());
        userDetailService.deleteUser().subscribe({
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

  describe('Request Activation Token', () => {
    beforeEach(() => {
      userDetailService = TestBed.inject(UserManagementDetailService);
      userDetailService.setUser(
        new User({
          _links: {
            self: { href: 'http://localhost/api/user/pactUserId' },
          },
          _templates: {
            ...defaultTemplate,
            ...requestActivationTokenTemplate,
          },
        }),
      );
    });

    it('successful', (done) => {
      const interaction: InteractionObject = RequestActivationTokenPact.successful;
      localStorage.setItem(TokenKeys.TOKEN, jwtToken({ authorities: [UserAuthority.USER_UPDATE] }));
      provider.addInteraction(interaction).then(() => {
        userDetailService.sendActivationToken().subscribe((response) => {
          expect(response).toBeTruthy();
          done();
        });
      });
    });

    it('user not found', (done) => {
      const interaction: InteractionObject = RequestActivationTokenPact.not_found;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TokenKeys.TOKEN, jwtToken({ authorities: [UserAuthority.USER_UPDATE] }));
        userDetailService.setUser(
          new User({
            _links: {
              self: { href: 'http://localhost/api/user/notFoundId' },
            },
            _templates: {
              ...defaultTemplate,
              ...requestActivationTokenTemplate,
            },
          }),
        );

        userDetailService.sendActivationToken().subscribe({
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
      const interaction: InteractionObject = RequestActivationTokenPact.unauthorized;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TokenKeys.TOKEN, jwtToken());
        userDetailService.sendActivationToken().subscribe({
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
