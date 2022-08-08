import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import {
  AuthorityAuthority,
  AuthorityManagementRelations,
  RoleManagementRelations,
  TokenKeys,
} from '@app/ui/shared/domain';
import { AdministrationService } from '@app/ui/shared/feature/administration';
import { HalFormClientModule, Link } from '@hal-form-client';
import { InteractionObject, Pact } from '@pact-foundation/pact';
import { AuthorityManagementService } from '../../../../ui/feature/administration/src/lib/modules/role-management/services/authority-management.service';
import { RoleManagementService } from '../../../../ui/feature/administration/src/lib/modules/role-management/services/role-management.service';
import { avengersAssemble } from '../../interceptor/pact.interceptor';
import { pactForResource } from '../../utils/pact.utils';
import { jwtToken } from '../../utils/token.utils';
import { GetAllAuthoritiesPact, GetOneAuthorityPact } from './authority.pact';

const provider: Pact = pactForResource('authority');

describe('Authority Pacts', () => {
  let service: AuthorityManagementService;

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
            [AuthorityManagementRelations.AUTHORITIES_REL]: {
              href: '/api/authority{?page,size,sort}',
              templated: true,
            },
          },
        },
      },
    });
    const roleService = new RoleManagementService(administrationService);
    service = new AuthorityManagementService(roleService);
  });

  describe('Get All Authorities', () => {
    it('successful', (done) => {
      const interaction: InteractionObject = GetAllAuthoritiesPact.successful;
      localStorage.setItem(TokenKeys.TOKEN, jwtToken({ authorities: [AuthorityAuthority.AUTHORITY_READ] }));
      provider.addInteraction(interaction).then(() => {
        service.getAllAuthorities().subscribe((authorities) => {
          expect(authorities).toBeTruthy();
          expect(authorities).toHaveLength(interaction.willRespondWith.body._embedded.authorityModels.length);
          done();
        });
      });
    });

    it('unauthorized', (done) => {
      const interaction: InteractionObject = GetAllAuthoritiesPact.unauthorized;
      localStorage.setItem(TokenKeys.TOKEN, jwtToken());
      provider.addInteraction(interaction).then(() => {
        service.getAllAuthorities().subscribe({
          error: (error: HttpErrorResponse) => {
            expect(error).toBeTruthy();
            expect(error.status).toBe(interaction.willRespondWith.status);
            expect(error.error).toMatchObject(interaction.willRespondWith.body);
            done();
          },
        });
      });
    });
  });

  describe('Get One Authority', () => {
    it('successful', (done) => {
      const interaction: InteractionObject = GetOneAuthorityPact.successful;
      localStorage.setItem(TokenKeys.TOKEN, jwtToken({ authorities: [AuthorityAuthority.AUTHORITY_READ] }));
      provider.addInteraction(interaction).then(() => {
        Link.ofHref('/api/authority/pactUpdateAuthorityId')
          .follow()
          .subscribe((authority) => {
            expect(authority).toBeTruthy();
            expect(authority).toMatchObject(interaction.willRespondWith.body);
            expect(authority.id).toEqual(interaction.willRespondWith.body.id);
            done();
          });
      });
    });

    it('unauthorized', (done) => {
      const interaction: InteractionObject = GetOneAuthorityPact.unauthorized;
      localStorage.setItem(TokenKeys.TOKEN, jwtToken());
      provider.addInteraction(interaction).then(() => {
        Link.ofHref('/api/authority/pactUpdateAuthorityId')
          .follow()
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

    it('not found', (done) => {
      const interaction: InteractionObject = GetOneAuthorityPact.not_found;
      localStorage.setItem(TokenKeys.TOKEN, jwtToken());
      provider.addInteraction(interaction).then(() => {
        Link.ofHref('/api/authority/notFoundId')
          .follow()
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
