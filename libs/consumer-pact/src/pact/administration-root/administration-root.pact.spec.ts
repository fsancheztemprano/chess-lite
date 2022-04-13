import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AdministrationRelations, TOKEN_KEY } from '@app/ui/shared/domain';
import { HalFormClientModule, HalFormService } from '@hal-form-client';
import { InteractionObject, Pact } from '@pact-foundation/pact';
import { noop } from 'rxjs';
import { AdministrationService } from '../../../../ui/feature/administration/src/lib/services/administration.service';
import { avengersAssemble } from '../../interceptor/pact.interceptor';
import { pactForResource } from '../../utils/pact.utils';
import { jwtToken } from '../../utils/token.util';
import { GetAdministrationRootResource } from './administration-root.pact';

const provider: Pact = pactForResource('administrationRoot');

describe('Administration Root Resource Pacts', () => {
  let service: AdministrationService;

  beforeAll(() => provider.setup());
  afterEach(() => provider.verify());
  afterAll(() => provider.finalize());

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HalFormClientModule.forRoot('/api')],
      providers: [avengersAssemble(provider.mockService.baseUrl)],
    });
    const halFormService: HalFormService = TestBed.inject(HalFormService);
    halFormService.setResource({
      _links: {
        self: {
          href: '/api',
        },
        [AdministrationRelations.ADMINISTRATION_REL]: {
          href: '/api/administration',
        },
      },
    });
    service = TestBed.inject(AdministrationService);
  });

  describe('get administration root resource with authority', () => {
    it('null', (done) => {
      const interaction: InteractionObject = GetAdministrationRootResource.as_unauthorized;
      provider.addInteraction(interaction).then(() => {
        jest.spyOn(console, 'error').mockImplementationOnce(noop);
        service.initialize().subscribe({
          error: (error: HttpErrorResponse) => {
            expect(error).toBeTruthy();
            expect(error.status).toBe(interaction.willRespondWith.status);
            expect(error.error).toMatchObject(interaction.willRespondWith.body);
            done();
          },
        });
      });
    });

    it('none', (done) => {
      const interaction: InteractionObject = GetAdministrationRootResource.as_authorized;
      provider.addInteraction(interaction).then(() => {
        jest.spyOn(console, 'error').mockImplementationOnce(noop);
        localStorage.setItem(TOKEN_KEY, jwtToken());
        service.initialize().subscribe({
          error: (error: HttpErrorResponse) => {
            expect(error).toBeTruthy();
            expect(error.status).toBe(interaction.willRespondWith.status);
            expect(error.error).toMatchObject(interaction.willRespondWith.body);
            done();
          },
        });
      });
    });

    it('admin:root', (done) => {
      const interaction = GetAdministrationRootResource.as_admin_root;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['admin:root'] }));
        service.initialize().subscribe((resource) => {
          expect(resource).toBeTruthy();
          expect(resource).toMatchObject(interaction.willRespondWith.body);
          done();
        });
      });
    });

    describe('admin:root &', () => {
      it('service-logs:read', (done) => {
        const interaction = GetAdministrationRootResource.as_admin_root__service_logs_read;
        provider.addInteraction(interaction).then(() => {
          localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['admin:root', 'service-logs:read'] }));
          service.initialize().subscribe({
            next: (resource) => {
              expect(resource).toBeTruthy();
              expect(resource).toMatchObject(interaction.willRespondWith.body);
              done();
            },
          });
        });
      });

      it('global-settings:read', (done) => {
        const interaction: InteractionObject = GetAdministrationRootResource.as_admin_root__global_settings_read;
        provider.addInteraction(interaction).then(() => {
          localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['admin:root', 'global-settings:read'] }));
          service.initialize().subscribe((resource) => {
            expect(resource).toBeTruthy();
            expect(resource).toMatchObject(interaction.willRespondWith.body);
            done();
          });
        });
      });

      it('admin:user-management:root', (done) => {
        const interaction = GetAdministrationRootResource.as_admin_user_management_root;
        provider.addInteraction(interaction).then(() => {
          localStorage.setItem(
            TOKEN_KEY,
            jwtToken({ authorities: ['admin:root', 'admin:user-management:root', 'user:read', 'user:create'] }),
          );
          service.initialize().subscribe((resource) => {
            expect(resource).toBeTruthy();
            expect(resource).toMatchObject(interaction.willRespondWith.body);
            done();
          });
        });
      });

      it('admin:role-management:root', (done) => {
        const interaction = GetAdministrationRootResource.as_admin_role_management_root;
        provider.addInteraction(interaction).then(() => {
          localStorage.setItem(
            TOKEN_KEY,
            jwtToken({
              authorities: ['admin:root', 'admin:role-management:root', 'role:read', 'role:create', 'authority:read'],
            }),
          );
          service.initialize().subscribe((resource) => {
            expect(resource).toBeTruthy();
            expect(resource).toMatchObject(interaction.willRespondWith.body);
            done();
          });
        });
      });
    });
  });
});
