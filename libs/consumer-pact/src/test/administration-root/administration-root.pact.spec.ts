import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AdministrationRelations, TOKEN_KEY } from '@app/domain';
import { HalFormClientModule, HalFormService } from '@hal-form-client';
import { InteractionObject, Pact } from '@pact-foundation/pact';
import { AdministrationService } from 'apps/app/src/app/modules/administration/services/administration.service';
import { GetAdministrationRootResource } from 'libs/consumer-pact/src/test/administration-root/administration-root.pact';
import { jwtToken } from 'libs/consumer-pact/src/utils/token.util';
import { noop } from 'rxjs';
import { avengersAssemble } from '../../interceptor/pact.interceptor';
import { pactForResource } from '../../utils/pact.utils';

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
    halFormService.setRootResource({
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
      provider.addInteraction(GetAdministrationRootResource.as_admin_root).then(() => {
        localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['admin:root'] }));
        service.initialize().subscribe({
          next: (resource) => {
            expect(resource).toBeTruthy();
            expect(resource).toMatchObject(GetAdministrationRootResource.as_admin_root.willRespondWith.body);
            done();
          },
        });
      });
    });

    describe('admin:root &', () => {
      it('service-logs:read', (done) => {
        provider.addInteraction(GetAdministrationRootResource.as_admin_root__service_logs_read).then(() => {
          localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['admin:root', 'service-logs:read'] }));
          service.initialize().subscribe({
            next: (resource) => {
              expect(resource).toBeTruthy();
              expect(resource).toMatchObject(
                GetAdministrationRootResource.as_admin_root__service_logs_read.willRespondWith.body,
              );
              done();
            },
          });
        });
      });

      it('global-settings:read', (done) => {
        provider.addInteraction(GetAdministrationRootResource.as_admin_root__service_logs_read).then(() => {
          localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['admin:root', 'service-logs:read'] }));
          service.initialize().subscribe({
            next: (resource) => {
              expect(resource).toBeTruthy();
              expect(resource).toMatchObject(
                GetAdministrationRootResource.as_admin_root__service_logs_read.willRespondWith.body,
              );
              done();
            },
          });
        });
      });

      it('admin:user-management:root', (done) => {
        provider.addInteraction(GetAdministrationRootResource.as_admin_user_management_root).then(() => {
          localStorage.setItem(
            TOKEN_KEY,
            jwtToken({ authorities: ['admin:root', 'admin:user-management:root', 'user:read', 'user:create'] }),
          );
          service.initialize().subscribe({
            next: (resource) => {
              expect(resource).toBeTruthy();
              expect(resource).toMatchObject(
                GetAdministrationRootResource.as_admin_user_management_root.willRespondWith.body,
              );
              done();
            },
          });
        });
      });

      it('admin:role-management:root', (done) => {
        provider.addInteraction(GetAdministrationRootResource.as_admin_role_management_root).then(() => {
          localStorage.setItem(
            TOKEN_KEY,
            jwtToken({
              authorities: ['admin:root', 'admin:role-management:root', 'role:read', 'role:create', 'authority:read'],
            }),
          );
          service.initialize().subscribe({
            next: (resource) => {
              expect(resource).toBeTruthy();
              expect(resource).toMatchObject(
                GetAdministrationRootResource.as_admin_role_management_root.willRespondWith.body,
              );
              done();
            },
          });
        });
      });
    });
  });
});
