import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import {
  AuthorityManagementRelations,
  Role,
  RoleAuthority,
  RoleManagementRelations,
  RolePage,
  TokenKeys,
} from '@app/ui/shared/domain';
import { AdministrationService } from '@app/ui/shared/feature/administration';
import { defaultTemplate } from '@app/ui/testing';
import { HalFormClientModule } from '@hal-form-client';
import { InteractionObject, Pact } from '@pact-foundation/pact';
import { RoleManagementService } from '../../../../ui/feature/administration/src/lib/modules/role-management/services/role-management.service';
import { avengersAssemble } from '../../interceptor/pact.interceptor';
import { pactForResource } from '../../utils/pact.utils';
import { jwtToken } from '../../utils/token.utils';
import { CreateRolePact, DeleteRolePact, GetAllRolesPact, GetOneRolePact, UpdateRolePact } from './role.pact';

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
    administrationService.setResource({
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
    service = new RoleManagementService(administrationService);
  });

  describe('Get All Roles', () => {
    it('successful', (done) => {
      const interaction: InteractionObject = GetAllRolesPact.successful;
      localStorage.setItem(TokenKeys.TOKEN, jwtToken({ authorities: [RoleAuthority.ROLE_READ] }));
      provider.addInteraction(interaction).then(() => {
        service.fetchRoles().subscribe((rolePage) => {
          expect(rolePage?._embedded?.roleModels).toBeTruthy();
          expect(rolePage._embedded.roleModels).toHaveLength(
            interaction.willRespondWith.body._embedded.roleModels.length,
          );
          expect(rolePage?._links?.ws?.href).toBe(interaction.willRespondWith.body._links.ws.href);
          done();
        });
      });
    });

    it('with create', (done) => {
      const interaction: InteractionObject = GetAllRolesPact.with_create;
      localStorage.setItem(
        TokenKeys.TOKEN,
        jwtToken({ authorities: [RoleAuthority.ROLE_READ, RoleAuthority.ROLE_CREATE] }),
      );
      provider.addInteraction(interaction).then(() => {
        service.fetchRoles().subscribe((rolePage) => {
          expect(rolePage?.hasTemplate('create')).toBe(true);
          done();
        });
      });
    });

    it('unauthorized', (done) => {
      const interaction: InteractionObject = GetAllRolesPact.unauthorized;
      localStorage.setItem(TokenKeys.TOKEN, jwtToken());
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
      localStorage.setItem(TokenKeys.TOKEN, jwtToken({ authorities: [RoleAuthority.ROLE_READ] }));
      provider.addInteraction(interaction).then(() => {
        service.fetchOneRole('pactRoleId').subscribe((role) => {
          expect(role).toBeTruthy();
          expect(role.id).toEqual(interaction.willRespondWith.body.id);
          expect(role.name).toEqual(interaction.willRespondWith.body.name);
          expect(role._links?.ws?.href).toStrictEqual(interaction.willRespondWith.body._links.ws.href);
          expect(role.authorities).toHaveLength(3);
          done();
        });
      });
    });

    it('with update', (done) => {
      const interaction: InteractionObject = GetOneRolePact.with_update;
      localStorage.setItem(
        TokenKeys.TOKEN,
        jwtToken({ authorities: [RoleAuthority.ROLE_READ, RoleAuthority.ROLE_UPDATE] }),
      );
      provider.addInteraction(interaction).then(() => {
        service.fetchOneRole('pactRoleId').subscribe((role) => {
          expect(role).toBeTruthy();
          expect(role.id).toEqual(interaction.willRespondWith.body.id);
          expect(role.name).toEqual(interaction.willRespondWith.body.name);
          expect(role.hasTemplate(RoleManagementRelations.ROLE_UPDATE_REL)).toBeTruthy();
          done();
        });
      });
    });

    it('with delete', (done) => {
      const interaction: InteractionObject = GetOneRolePact.with_delete;
      localStorage.setItem(
        TokenKeys.TOKEN,
        jwtToken({ authorities: [RoleAuthority.ROLE_READ, RoleAuthority.ROLE_DELETE] }),
      );
      provider.addInteraction(interaction).then(() => {
        service.fetchOneRole('pactRoleId').subscribe((role) => {
          expect(role).toBeTruthy();
          expect(role.id).toEqual(interaction.willRespondWith.body.id);
          expect(role.name).toEqual(interaction.willRespondWith.body.name);
          expect(role.hasTemplate(RoleManagementRelations.ROLE_DELETE_REL)).toBeTruthy();
          done();
        });
      });
    });

    it('not found', (done) => {
      const interaction: InteractionObject = GetOneRolePact.not_found;
      localStorage.setItem(TokenKeys.TOKEN, jwtToken({ authorities: [RoleAuthority.ROLE_READ] }));
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
      localStorage.setItem(TokenKeys.TOKEN, jwtToken());
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
          ...defaultTemplate,
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
      localStorage.setItem(TokenKeys.TOKEN, jwtToken({ authorities: [RoleAuthority.ROLE_CREATE] }));
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
      localStorage.setItem(TokenKeys.TOKEN, jwtToken({ authorities: [RoleAuthority.ROLE_CREATE] }));
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
      localStorage.setItem(TokenKeys.TOKEN, jwtToken());
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

  describe('Update Role', () => {
    let pactRole: Role;

    beforeEach(() => {
      pactRole = new Role({
        _links: {
          self: {
            href: '/api/role/pactRoleId',
          },
        },
        _templates: {
          ...defaultTemplate,
          update: {
            method: 'PATCH',
            properties: [
              {
                name: 'authorityIds',
              },
              {
                name: 'canLogin',
              },
              {
                name: 'name',
                minLength: 3,
                maxLength: 128,
                type: 'text',
              },
            ],
          },
        },
      });
    });

    it('successful', (done) => {
      const interaction: InteractionObject = UpdateRolePact.successful;
      localStorage.setItem(TokenKeys.TOKEN, jwtToken({ authorities: [RoleAuthority.ROLE_CREATE] }));
      provider.addInteraction(interaction).then(() => {
        service.updateRole(pactRole, { name: 'PACT_ROLE' }).subscribe((role) => {
          expect(role).toBeTruthy();
          expect(role.id).toEqual(interaction.willRespondWith.body.id);
          expect(role.name).toEqual(interaction.willRespondWith.body.name);
          expect(role.authorities).toHaveLength(interaction.willRespondWith.body.authorities.length);
          done();
        });
      });
    });

    it('core role', (done) => {
      const interaction: InteractionObject = UpdateRolePact.core_role;
      localStorage.setItem(TokenKeys.TOKEN, jwtToken({ authorities: [RoleAuthority.ROLE_CREATE] }));
      provider.addInteraction(interaction).then(() => {
        const coreRole = JSON.parse(JSON.stringify(pactRole));
        coreRole._templates.update.target = '/api/role/coreRoleId';
        service.updateRole(new Role(coreRole), { name: 'PACT_ROLE' }).subscribe({
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
      const interaction: InteractionObject = UpdateRolePact.unauthorized;
      localStorage.setItem(TokenKeys.TOKEN, jwtToken());
      provider.addInteraction(interaction).then(() => {
        service.updateRole(pactRole, { name: 'PACT_ROLE' }).subscribe({
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
      const interaction: InteractionObject = UpdateRolePact.not_found;
      localStorage.setItem(TokenKeys.TOKEN, jwtToken());
      provider.addInteraction(interaction).then(() => {
        const notFoundRole = JSON.parse(JSON.stringify(pactRole));
        notFoundRole._templates.update.target = '/api/role/notFoundId';
        service.updateRole(new Role(notFoundRole), { name: 'PACT_ROLE' }).subscribe({
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

  describe('Delete Role', () => {
    let pactRole: Role;

    beforeEach(() => {
      pactRole = new Role({
        _links: {
          self: {
            href: '/api/role/pactRoleId',
          },
        },
        _templates: {
          ...defaultTemplate,
          delete: {
            method: 'DELETE',
            properties: [],
          },
        },
      });
    });

    it('successful', (done) => {
      const interaction: InteractionObject = DeleteRolePact.successful;
      localStorage.setItem(TokenKeys.TOKEN, jwtToken({ authorities: [RoleAuthority.ROLE_DELETE] }));
      provider.addInteraction(interaction).then(() => {
        service.deleteRole(pactRole).subscribe((role) => {
          expect(role).toBeTruthy();
          done();
        });
      });
    });

    it('core role', (done) => {
      const interaction: InteractionObject = DeleteRolePact.core_role;
      localStorage.setItem(TokenKeys.TOKEN, jwtToken({ authorities: [RoleAuthority.ROLE_DELETE] }));
      provider.addInteraction(interaction).then(() => {
        const coreRole = JSON.parse(JSON.stringify(pactRole));
        coreRole._templates.delete.target = '/api/role/coreRoleId';
        service.deleteRole(new Role(coreRole)).subscribe({
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
      const interaction: InteractionObject = DeleteRolePact.unauthorized;
      localStorage.setItem(TokenKeys.TOKEN, jwtToken());
      provider.addInteraction(interaction).then(() => {
        service.deleteRole(pactRole).subscribe({
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
      const interaction: InteractionObject = DeleteRolePact.not_found;
      localStorage.setItem(TokenKeys.TOKEN, jwtToken({ authorities: [RoleAuthority.ROLE_DELETE] }));
      provider.addInteraction(interaction).then(() => {
        const notFoundRole = JSON.parse(JSON.stringify(pactRole));
        notFoundRole._templates.delete.target = '/api/role/notFoundId';
        service.deleteRole(new Role(notFoundRole)).subscribe({
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
