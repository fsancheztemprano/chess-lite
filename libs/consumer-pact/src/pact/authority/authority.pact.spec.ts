import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AuthorityManagementRelations, RoleManagementRelations, TOKEN_KEY } from '@app/domain';
import { HalFormClientModule, Link } from '@hal-form-client';
import { InteractionObject, Pact } from '@pact-foundation/pact';
import { jwtToken } from 'libs/consumer-pact/src/utils/token.util';
import { AuthorityManagementService } from 'libs/ui/feature/administration/src/lib/modules/role-management/services/authority-management.service';
import { RoleManagementService } from 'libs/ui/feature/administration/src/lib/modules/role-management/services/role-management.service';
import { AdministrationService } from 'libs/ui/feature/administration/src/lib/services/administration.service';
import { avengersAssemble } from '../../interceptor/pact.interceptor';
import { pactForResource } from '../../utils/pact.utils';
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
    administrationService.setRootResource({
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
    const roleService = new RoleManagementService(TestBed.inject(HttpClient), administrationService);
    service = new AuthorityManagementService(roleService);
  });

  describe('Get All Authorities', () => {
    it('successful', (done) => {
      const interaction: InteractionObject = GetAllAuthoritiesPact.successful;
      localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['authority:read'] }));
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
      localStorage.setItem(TOKEN_KEY, jwtToken());
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
      localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['authority:read'] }));
      provider.addInteraction(interaction).then(() => {
        Link.ofUrl('/api/authority/pactUpdateAuthorityId')
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
      localStorage.setItem(TOKEN_KEY, jwtToken());
      provider.addInteraction(interaction).then(() => {
        Link.ofUrl('/api/authority/pactUpdateAuthorityId')
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
      localStorage.setItem(TOKEN_KEY, jwtToken());
      provider.addInteraction(interaction).then(() => {
        Link.ofUrl('/api/authority/notFoundId')
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
