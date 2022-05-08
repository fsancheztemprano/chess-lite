import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AdministrationRelations, ServiceLogs, TokenKeys } from '@app/ui/shared/domain';
import { AdministrationService } from '@app/ui/shared/feature/administration';
import { defaultTemplate } from '@app/ui/testing';
import { HalFormClientModule } from '@hal-form-client';
import { InteractionObject, Pact } from '@pact-foundation/pact';
import { ServiceLogsService } from '../../../../ui/feature/administration/src/lib/modules/service-logs/services/service-logs.service';
import { avengersAssemble } from '../../interceptor/pact.interceptor';
import { pactForResource } from '../../utils/pact.utils';
import { jwtToken } from '../../utils/token.util';
import { DeleteServiceLogsPact, GetServiceLogsPact } from './service-logs.pact';

const provider: Pact = pactForResource('serviceLogs');

describe('Service Logs Pacts', () => {
  let service: ServiceLogsService;

  beforeAll(() => provider.setup());
  afterEach(() => provider.verify());
  afterAll(() => provider.finalize());

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HalFormClientModule],
      providers: [avengersAssemble(provider.mockService.baseUrl)],
    });

    const administrationService: AdministrationService = TestBed.inject(AdministrationService);
    administrationService.setResource({
      _links: {
        self: { href: '/api/administration' },
        [AdministrationRelations.SERVICE_LOGS_REL]: {
          href: '/api/administration/service-logs',
        },
      },
    });
    service = new ServiceLogsService(administrationService);
  });

  describe('Get Service Logs', () => {
    it('successful', (done) => {
      const interaction: InteractionObject = GetServiceLogsPact.successful;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TokenKeys.TOKEN, jwtToken({ authorities: ['service-logs:read'] }));
        service.getServiceLogs().subscribe((logs: ServiceLogs) => {
          expect(logs).toBeTruthy();
          expect(logs.logs).toBeTruthy();
          expect(logs.timestamp).toBeTruthy();
          expect(logs._links).toMatchObject(interaction.willRespondWith.body._links);
          expect(logs._templates).toMatchObject(interaction.willRespondWith.body._templates);
          done();
        });
      });
    });

    it('with delete', (done) => {
      const interaction: InteractionObject = GetServiceLogsPact.with_delete;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TokenKeys.TOKEN, jwtToken({ authorities: ['service-logs:read', 'service-logs:delete'] }));
        service.getServiceLogs().subscribe((logs: ServiceLogs) => {
          expect(logs).toBeTruthy();
          expect(logs._templates).toMatchObject(interaction.willRespondWith.body._templates);
          done();
        });
      });
    });

    it('unauthorized', (done) => {
      const interaction: InteractionObject = GetServiceLogsPact.unauthorized;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TokenKeys.TOKEN, jwtToken());
        service.getServiceLogs().subscribe({
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

  describe('Delete Service Logs', () => {
    let serviceLogs: ServiceLogs;

    beforeEach(() => {
      serviceLogs = new ServiceLogs({
        logs: 'logs',
        timestamp: '2022-03-12T11:23:31.493+00:00',
        _links: { self: { href: '/api/administration/service-logs' } },
        _templates: {
          ...defaultTemplate,
          deleteServiceLogs: { method: 'DELETE', properties: [] },
        },
      });
    });

    it('successful', (done) => {
      const interaction: InteractionObject = DeleteServiceLogsPact.successful;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TokenKeys.TOKEN, jwtToken({ authorities: ['service-logs:delete'] }));
        service.deleteServiceLogs(serviceLogs).subscribe((logs: ServiceLogs) => {
          expect(logs).toBeTruthy();
          expect(logs.logs).toBeTruthy();
          expect(logs.timestamp).toBeTruthy();
          expect(logs._links).toMatchObject(interaction.willRespondWith.body._links);
          expect(logs._templates).toMatchObject(interaction.willRespondWith.body._templates);
          done();
        });
      });
    });

    it('unauthorized', (done) => {
      const interaction: InteractionObject = DeleteServiceLogsPact.unauthorized;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TokenKeys.TOKEN, jwtToken());
        service.deleteServiceLogs(serviceLogs).subscribe({
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
