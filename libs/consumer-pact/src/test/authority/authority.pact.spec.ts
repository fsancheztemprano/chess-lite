import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AuthorityManagementRelations, RoleManagementRelations, TOKEN_KEY } from '@app/domain';
import { ContentTypeEnum, HalFormClientModule } from '@hal-form-client';
import { InteractionObject, Pact } from '@pact-foundation/pact';
import { AuthorityManagementService } from 'apps/app/src/app/modules/administration/modules/role-management/services/authority-management.service';
import { RoleManagementService } from 'apps/app/src/app/modules/administration/modules/role-management/services/role-management.service';
import { AdministrationService } from 'apps/app/src/app/modules/administration/services/administration.service';
import { jwtToken } from 'libs/consumer-pact/src/utils/token.util';
import { avengersAssemble } from '../../interceptor/pact.interceptor';
import { pactForResource } from '../../utils/pact.utils';
import { GetAllAuthoritiesPact, GetOneAuthorityPact } from './authority.pact';

const provider: Pact = pactForResource('authority');

describe('Authority Pacts', () => {
  let service: AuthorityManagementService;
  let http: HttpClient;

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
    http = TestBed.inject(HttpClient);
    const roleService = new RoleManagementService(http, administrationService);
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
    const options = { headers: { Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS } };

    it('successful', (done) => {
      const interaction: InteractionObject = GetOneAuthorityPact.successful;
      localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['authority:read'] }));
      provider.addInteraction(interaction).then(() => {
        http.get('/api/authority/authorityId', options).subscribe((authority) => {
          expect(authority).toBeTruthy();
          expect(authority).toEqual(interaction.willRespondWith.body);
          done();
        });
      });
    });

    it('unauthorized', (done) => {
      const interaction: InteractionObject = GetOneAuthorityPact.unauthorized;
      localStorage.setItem(TOKEN_KEY, jwtToken());
      provider.addInteraction(interaction).then(() => {
        http.get('/api/authority/authorityId', options).subscribe({
          error: (error: HttpErrorResponse) => {
            expect(error).toBeTruthy();
            expect(error.status).toBe(interaction.willRespondWith.status);
            expect(error.error).toMatchObject(interaction.willRespondWith.body);
            done();
          },
        });
      });
    });

    it('not found', (done) => {
      const interaction: InteractionObject = GetOneAuthorityPact.not_found;
      localStorage.setItem(TOKEN_KEY, jwtToken());
      provider.addInteraction(interaction).then(() => {
        http.get('/api/authority/notFoundId', options).subscribe({
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
});
