import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AuthorityManagementRelations, RoleManagementRelations, RolePage, TOKEN_KEY } from '@app/domain';
import { HalFormClientModule } from '@hal-form-client';
import { InteractionObject, Pact } from '@pact-foundation/pact';
import { AdministrationService } from 'apps/app/src/app/modules/administration/services/administration.service';
import { jwtToken } from 'libs/consumer-pact/src/utils/token.util';
import { RoleManagementService } from '../../../../../apps/app/src/app/modules/administration/modules/role-management/services/role-management.service';
import { avengersAssemble } from '../../interceptor/pact.interceptor';
import { pactForResource } from '../../utils/pact.utils';
import { CreateRolePact, GetAllRolesPact, GetOneRolePact } from './role.pact';

const provider: Pact = pactForResource('role');

describe('Role Pacts', () => {
  let service: RoleManagementService;

  beforeAll(() => provider.setup());
  afterEach(() => provider.verify());
  afterAll(() => provider.finalize());

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HalFormClientModule],
      providers: [avengersAssemble(provider.mockService.baseUrl), AdministrationService],
    });

    const administrationService: AdministrationService = TestBed.inject(AdministrationService);
    administrationService.setRootResource({
      _embedded: {
        [RoleManagementRelations.ROLE_MANAGEMENT_REL]: {
          _links: {
            self: {
              href: '/api/administration',
            },
            [RoleManagementRelations.ROLE_REL]: {
              href: '/api/role/{roleId}',
              templated: true,
            },
            [RoleManagementRelations.ROLES_REL]: {
              href: '/api/role{?search,page,size,sort}',
              templated: true,
            },
            [AuthorityManagementRelations.AUTHORITIES_REL]: {
              href: '/api/authority{?page,size,sort}',
              templated: true,
            },
          },
          _templates: {
            default: {
              method: 'HEAD',
              properties: [],
            },
            create: {
              method: 'POST',
              properties: [
                {
                  name: 'name',
                  required: true,
                  minLength: 3,
                  maxLength: 128,
                  type: 'text',
                },
              ],
              target: '/api/role',
            },
          },
        },
      },
    });
    service = new RoleManagementService(TestBed.inject(HttpClient), administrationService);
  });

  describe('Get All Roles', () => {
    it('successful', (done) => {
      const interaction: InteractionObject = GetAllRolesPact.successful;
      localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['role:read'] }));
      provider.addInteraction(interaction).then(() => {
        service.fetchRoles().subscribe((rolePage) => {
          expect(rolePage?._embedded?.roleModels).toBeTruthy();
          expect(rolePage._embedded.roleModels).toHaveLength(
            interaction.willRespondWith.body._embedded.roleModels.length,
          );
          done();
        });
      });
    });

    it('with create', (done) => {
      const interaction: InteractionObject = GetAllRolesPact.with_create;
      localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['role:read', 'role:create'] }));
      provider.addInteraction(interaction).then(() => {
        service.fetchRoles().subscribe((rolePage) => {
          expect(rolePage?.isAllowedTo('create')).toBe(true);
          done();
        });
      });
    });

    it('unauthorized', (done) => {
      const interaction: InteractionObject = GetAllRolesPact.unauthorized;
      localStorage.setItem(TOKEN_KEY, jwtToken());
      provider.addInteraction(interaction).then(() => {
        service.fetchRoles().subscribe({
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

  describe('Get One Role', () => {
    it('successful', (done) => {
      const interaction: InteractionObject = GetOneRolePact.successful;
      localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['role:read'] }));
      provider.addInteraction(interaction).then(() => {
        service.fetchOneRole('pactRoleId').subscribe((role) => {
          expect(role).toBeTruthy();
          expect(role.id).toEqual(interaction.willRespondWith.body.id);
          expect(role.name).toEqual(interaction.willRespondWith.body.name);
          expect(role.authorities).toHaveLength(3);
          done();
        });
      });
    });

    it('with update', (done) => {
      const interaction: InteractionObject = GetOneRolePact.with_update;
      localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['role:read', 'role:update'] }));
      provider.addInteraction(interaction).then(() => {
        service.fetchOneRole('pactRoleId').subscribe((role) => {
          expect(role).toBeTruthy();
          expect(role.id).toEqual(interaction.willRespondWith.body.id);
          expect(role.name).toEqual(interaction.willRespondWith.body.name);
          expect(role.isAllowedTo(RoleManagementRelations.ROLE_UPDATE_REL)).toBeTruthy();
          done();
        });
      });
    });

    it('with delete', (done) => {
      const interaction: InteractionObject = GetOneRolePact.with_delete;
      localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['role:read', 'role:delete'] }));
      provider.addInteraction(interaction).then(() => {
        service.fetchOneRole('pactRoleId').subscribe((role) => {
          expect(role).toBeTruthy();
          expect(role.id).toEqual(interaction.willRespondWith.body.id);
          expect(role.name).toEqual(interaction.willRespondWith.body.name);
          expect(role.isAllowedTo(RoleManagementRelations.ROLE_DELETE_REL)).toBeTruthy();
          done();
        });
      });
    });

    it('not found', (done) => {
      const interaction: InteractionObject = GetOneRolePact.not_found;
      localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['role:read'] }));
      provider.addInteraction(interaction).then(() => {
        service.fetchOneRole('notFoundId').subscribe({
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
      const interaction: InteractionObject = GetOneRolePact.unauthorized;
      localStorage.setItem(TOKEN_KEY, jwtToken());
      provider.addInteraction(interaction).then(() => {
        service.fetchOneRole('pactRoleId').subscribe({
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

  describe('Create Role', () => {
    let rolePage: RolePage;

    beforeEach(() => {
      rolePage = new RolePage({
        _templates: {
          default: {
            method: 'HEAD',
            properties: [],
          },
          create: {
            method: 'POST',
            properties: [
              {
                name: 'name',
                required: true,
                minLength: 3,
                maxLength: 128,
                type: 'text',
              },
            ],
            target: '/api/role',
          },
        },
      });
    });

    it('successful', (done) => {
      const interaction: InteractionObject = CreateRolePact.successful;
      localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['role:create'] }));
      provider.addInteraction(interaction).then(() => {
        service.createRole(rolePage, 'NEW_PACT_ROLE').subscribe((role) => {
          expect(role).toBeTruthy();
          expect(role.id).toEqual(interaction.willRespondWith.body.id);
          expect(role.name).toEqual(interaction.willRespondWith.body.name);
          expect(role.authorities).toHaveLength(interaction.willRespondWith.body.authorities.min);
          done();
        });
      });
    });

    it('existing', (done) => {
      const interaction: InteractionObject = CreateRolePact.existing;
      localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['role:create'] }));
      provider.addInteraction(interaction).then(() => {
        service.createRole(rolePage, 'PACT_ROLE').subscribe({
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
      const interaction: InteractionObject = CreateRolePact.unauthorized;
      localStorage.setItem(TOKEN_KEY, jwtToken());
      provider.addInteraction(interaction).then(() => {
        service.createRole(rolePage, 'NEW_PACT_ROLE').subscribe({
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
